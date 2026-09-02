"use client";

import { useCallback, useMemo, useState } from "react";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { LineItemIdentifier } from "@mui/x-charts/models";
import { useQuery } from "@tanstack/react-query";
import getCollectionTaskHistory from "@/actions/collection/getCollectionTaskHistory";
import { TaskHistoryTask, TaskHistorySummary } from "@/types/api";
import {
  buildTaskSeries,
  groupByTaskType,
  TaskSeriesPoint,
} from "./taskSeries";
import DragRangeOverlay from "./DragRangeOverlay";
import TaskDetailModal from "./TaskDetailModal";
import {
  describeDurations,
  formatConcurrency,
  formatDuration,
  isEmptySeries,
} from "./taskHistory";
import {
  CHART_HEIGHT,
  TASK_TYPE_COLOURS,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from "./telemetryChart";
import {
  binWidthMinutes,
  formatBinLabel,
  rangeFromBins,
  tickStep,
  TimeRange,
} from "./timeRange";

// Durations are plotted in seconds: milliseconds put five digits on every tick
// and the axis label then has to carry the unit anyway.
const MS_PER_SECOND = 1000;

const toSeconds = (ms: number | null): number | null =>
  ms === null ? null : ms / MS_PER_SECOND;

/** A task type, its colour and its own binned series. */
interface TypeGroup {
  type: string;
  label: string;
  colour: string;
  points: TaskSeriesPoint[];
}

const CONCURRENCY_SERIES = "concurrency-max";
const DURATION_SERIES = "duration-p50";

// A series belongs to one measure and one task type. The type goes last so a
// clicked mark maps straight back to its group, whatever the type is named.
const seriesId = (measure: string, type: string) => `${measure}::${type}`;

const summaryLine = (summary: TaskHistorySummary): string => {
  const byType = Object.entries(summary.task_types)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => `${type} ${count}`)
    .join(" · ");

  const outcomes = [
    `${summary.tasks.toLocaleString()} task${summary.tasks === 1 ? "" : "s"}${
      byType ? ` (${byType})` : ""
    }`,
    `${summary.succeeded.toLocaleString()} succeeded`,
    `${summary.failed.toLocaleString()} failed`,
  ];

  if (summary.in_flight > 0) outcomes.push(`${summary.in_flight} in flight`);
  if (summary.pending > 0) outcomes.push(`${summary.pending} pending`);
  if (summary.attempts.retried_tasks > 0) {
    outcomes.push(
      `${summary.attempts.retried_tasks} retried (max ${summary.attempts.max} attempts)`,
    );
  }

  return `${outcomes.join(" · ")} — ${describeDurations(summary.duration_ms)}`;
};

interface TaskHistoryChartProps {
  collectionPid: string;
  bin: string;
  range: TimeRange;
  enabled: boolean;
  onSelectRange: (range: TimeRange) => void;
}

const TaskHistoryChart = ({
  collectionPid,
  bin,
  range,
  enabled,
  onSelectRange,
}: TaskHistoryChartProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["collection-task-history", collectionPid, bin, range],
    queryFn: () => getCollectionTaskHistory(collectionPid, range),
    enabled,
    refetchOnWindowFocus: false,
  });
  const history = data?.data;
  const tasks = useMemo(() => history?.tasks.data ?? [], [history]);

  const [openBin, setOpenBin] = useState<{
    label: string;
    typeLabel: string;
    tasks: TaskHistoryTask[];
  } | null>(null);

  // The endpoint serves a task list, not a series, so the bins are built here.
  // Everything they need — each run's claim, finish and duration — is on the
  // tasks already, so this needs no extra request. One series per task type:
  // an A-type cohort query and a B-type distribution are not the same workload.
  const groups = useMemo<TypeGroup[]>(
    () =>
      [...groupByTaskType(tasks)].map(([type, group], index) => ({
        type,
        label: `${type.toUpperCase()}-type`,
        colour: TASK_TYPE_COLOURS[index % TASK_TYPE_COLOURS.length],
        points: buildTaskSeries(group, bin, range),
      })),
    [tasks, bin, range],
  );

  // Bins come from the range alone, so an empty task list still gives the axis
  // its labels and every group stays index-aligned with them.
  const bins = useMemo(() => buildTaskSeries([], bin, range), [bin, range]);

  // A range holding more tasks than the action will page through plots only
  // what it fetched, so say so rather than showing a quietly partial chart.
  const omitted = (history?.tasks.total ?? 0) - tasks.length;

  const labels = useMemo(
    () => bins.map((point) => formatBinLabel(point.bin, bin)),
    [bins, bin],
  );

  const isEmpty = groups.every((group) => isEmptySeries(group.points));

  const handleDragSelect = useCallback(
    (startIndex: number, endIndex: number) => {
      if (!history) return;

      const next = rangeFromBins(
        bins.map((point) => point.bin),
        startIndex,
        endIndex,
        bin,
        history.to,
      );
      if (next) onSelectRange(next);
    },
    [history, bins, bin, onSelectRange],
  );

  // Series ids carry their type as a suffix, so a clicked mark resolves to the
  // group it belongs to and from there to the tasks that made up that bin.
  const handleMarkClick = useCallback(
    (_: unknown, { seriesId: id, dataIndex }: LineItemIdentifier) => {
      if (dataIndex === undefined) return;

      const type = String(id).split("::")[1];
      const group = groups.find((candidate) => candidate.type === type);
      const point = group?.points[dataIndex];
      if (!group || !point) return;

      const width = binWidthMinutes(bin) ?? 0;
      const start = formatBinLabel(point.bin, bin);
      const end = formatBinLabel(
        new Date(Date.parse(point.bin) + width * 60_000).toISOString(),
        bin,
      );

      setOpenBin({
        label: `${start} – ${end}`,
        typeLabel: group.label,
        tasks: tasks.filter((task) => point.taskPids.includes(task.pid)),
      });
    },
    [groups, tasks, bin],
  );

  const formatConcurrencyPoint = (
    point: TaskSeriesPoint | undefined,
    value: number | null,
  ) => {
    if (value === null || !point) return "no data yet";

    return `${formatConcurrency(value)} at peak · ${point.started} started · ${point.finished} finished`;
  };

  const formatDurationPoint = (
    point: TaskSeriesPoint | undefined,
    value: number | null,
  ) => {
    if (value === null || !point) return "no runs settled";

    return `${formatDuration(value * MS_PER_SECOND)} · ${describeDurations(point.duration_ms)}`;
  };

  const sharedXAxis = {
    scaleType: "point" as const,
    data: labels,
    height: X_AXIS_HEIGHT,
    tickLabelStyle: { fontSize: 11 },
    tickLabelInterval: (_: unknown, index: number) =>
      index % tickStep(labels.length) === 0,
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2">Task activity</Typography>

      {enabled && isLoading && (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ mb: 1 }} />
      )}

      {enabled && isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Could not load task history for this collection.
        </Alert>
      )}

      {/* The summary is whole-range, so it stands on its own when there is no
          per-bin series to plot — the endpoint does not serve one yet. */}
      {history && isEmpty && (
        <Stack spacing={0.25}>
          {history.summary.tasks === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No tasks ran on this collection in this window.
            </Typography>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary">
                {summaryLine(history.summary)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                None of them overlapped the bins in this range.
              </Typography>
            </>
          )}
        </Stack>
      )}

      {history && !isEmpty && (
        <>
          {/* Side by side while the panel is wide enough for both, stacking
              on its own once it is not. */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 2,
            }}
          >
            <LineChart
              height={CHART_HEIGHT}
              xAxis={[{ ...sharedXAxis }]}
              yAxis={[{ label: "runs in flight", min: 0, width: Y_AXIS_WIDTH }]}
              onMarkClick={handleMarkClick}
              series={groups.map((group) => ({
                id: seriesId(CONCURRENCY_SERIES, group.type),
                data: group.points.map((point) => point.concurrency_max),
                label: group.label,
                color: group.colour,
                // Only bins that actually ran something carry a mark — a zero
                // is a real value here, so marking every one of them draws a
                // dotted line along the baseline and hides the peaks.
                showMark: ({ index }) =>
                  (group.points[index]?.concurrency_max ?? 0) > 0,
                valueFormatter: (value, { dataIndex }) =>
                  formatConcurrencyPoint(group.points[dataIndex], value),
              }))}
            >
              <DragRangeOverlay onSelect={handleDragSelect} />
            </LineChart>

            <LineChart
              height={CHART_HEIGHT}
              xAxis={[{ ...sharedXAxis }]}
              yAxis={[{ label: "seconds", min: 0, width: Y_AXIS_WIDTH }]}
              onMarkClick={handleMarkClick}
              series={groups.map((group) => ({
                id: seriesId(DURATION_SERIES, group.type),
                data: group.points.map((point) =>
                  toSeconds(point.duration_ms.p50),
                ),
                label: group.label,
                color: group.colour,
                showMark: ({ index }) =>
                  group.points[index]?.duration_ms.p50 !== null,
                valueFormatter: (value, { dataIndex }) =>
                  formatDurationPoint(group.points[dataIndex], value),
              }))}
            >
              <DragRangeOverlay onSelect={handleDragSelect} />
            </LineChart>
          </Box>

          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {summaryLine(history.summary)}
            </Typography>
            {omitted > 0 && (
              <Typography variant="caption" color="warning.main">
                Showing the most recent {tasks.length.toLocaleString()} of{" "}
                {history.tasks.total.toLocaleString()} tasks — narrow the range
                to plot them all.
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Left plot counts runs overlapping each bin at their peak; right
              plot attributes a run&apos;s duration to the bin it finished in,
              so a long run appears in the right one well after the left.
              Timed-out runs count as failures and are left out of the duration
              figures — they have no end. Click any point to see what ran.
            </Typography>
          </Stack>
        </>
      )}

      {openBin && (
        <TaskDetailModal
          // A fresh bin is a fresh modal, so no selection carries across.
          key={`${openBin.typeLabel}-${openBin.label}`}
          open
          onClose={() => setOpenBin(null)}
          binLabel={openBin.label}
          typeLabel={openBin.typeLabel}
          tasks={openBin.tasks}
        />
      )}
    </Box>
  );
};

export default TaskHistoryChart;
