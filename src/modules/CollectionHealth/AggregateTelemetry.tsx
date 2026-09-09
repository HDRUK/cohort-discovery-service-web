"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  Alert,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FormMultiSelect, { OptionsType } from "@/components/FormMultiSelect";
import MultiSeriesLineChart, {
  ChartLegend,
} from "@/components/MultiSeriesLineChart";
import SectionCard from "@/components/SectionCard";
import useSearchParams from "@/hooks/useSearchParams";
import {
  AggregateEntry,
  buildAggregateSeries,
  PingTaskType,
  servedTo,
} from "./aggregateSeries";
import { CollectionHealthRow, LEVEL_RANK } from "./health";
import {
  assignColourSlots,
  fromSlotList,
  MAX_PLOTTED_COLLECTIONS,
  plottablePids,
  toSlotList,
} from "./seriesColours";
import TelemetryRangeCard from "./TelemetryRangeCard";
import { useSeriesColours } from "./telemetryChart";
import { rangeFromBins } from "./timeRange";
import useAggregateHealth from "./useAggregateHealth";
import { TelemetryRange } from "./useTelemetryRange";

const PARAM_COLLECTIONS = "collections";
const PARAM_TASK_TYPE = "taskType";

const Y_AXIS_LABEL = "polls / min";

const CHART_HEIGHT = 360;

const DRAG_HINT =
  "Drag across the plot to narrow the range. Rates are not comparable between collections — read the shape and the gaps, not the height.";

type TaskTypeFilter = "a" | "b" | "both";

const TASK_TYPES: Record<TaskTypeFilter, PingTaskType[]> = {
  a: ["a"],
  b: ["b"],
  both: ["a", "b"],
};

const TASK_TYPE_LABELS: Record<TaskTypeFilter, string> = {
  a: "A-type",
  b: "B-type",
  both: "Both",
};

const isTaskTypeFilter = (value: string | null): value is TaskTypeFilter =>
  value === "a" || value === "b" || value === "both";

interface AggregateTelemetryProps {
  rows: CollectionHealthRow[];
  telemetry: TelemetryRange;
}

const AggregateTelemetry = ({ rows, telemetry }: AggregateTelemetryProps) => {
  const { bin, range, validationMessage, isQueryValid, handleSelectRange } =
    telemetry;
  const { searchParams, setSearchParams } = useSearchParams();
  const palette = useSeriesColours();

  const selectedParam = searchParams.get(PARAM_COLLECTIONS);

  const slots = useMemo(
    () => fromSlotList((selectedParam ?? "").split(",")),
    [selectedParam],
  );

  const rawTaskType = searchParams.get(PARAM_TASK_TYPE);
  const taskTypeFilter: TaskTypeFilter = isTaskTypeFilter(rawTaskType)
    ? rawTaskType
    : "both";

  useEffect(() => {
    if (selectedParam !== null || !rows.length) return;

    const defaults = [...rows]
      .sort((a, b) => LEVEL_RANK[b.overall.level] - LEVEL_RANK[a.overall.level])
      .slice(0, MAX_PLOTTED_COLLECTIONS)
      .map((row) => row.pid);

    setSearchParams({ [PARAM_COLLECTIONS]: defaults.join(",") });
  }, [selectedParam, rows, setSearchParams]);

  const plotted = useMemo(() => plottablePids(slots), [slots]);

  const { healthByPid, isLoading, failedPids } = useAggregateHealth(
    plotted,
    bin,
    range,
    isQueryValid,
  );

  const nameByPid = useMemo(
    () => Object.fromEntries(rows.map((row) => [row.pid, row.name])),
    [rows],
  );

  const entries = useMemo<AggregateEntry[]>(
    () =>
      plotted.map((pid) => ({
        pid,
        name: nameByPid[pid] ?? pid,
        colour: palette[slots[pid] % palette.length],
        health: healthByPid[pid] ?? null,
      })),
    [plotted, nameByPid, palette, slots, healthByPid],
  );

  const { labels, series, binStarts } = useMemo(
    () => buildAggregateSeries(entries, TASK_TYPES[taskTypeFilter], bin),
    [entries, taskTypeFilter, bin],
  );

  const legendEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.health !== null)
        .map((entry) => ({
          key: entry.pid,
          label: entry.name,
          colour: entry.colour,
        })),
    [entries],
  );

  const options = useMemo<OptionsType[]>(
    () => rows.map((row) => ({ value: row.pid, label: row.name })),
    [rows],
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => slots[String(option.value)] !== undefined),
    [options, slots],
  );

  const handleCollectionsChange = useCallback(
    (value: OptionsType | OptionsType[]) => {
      const next = (Array.isArray(value) ? value : [value])
        .filter(Boolean)
        .map((option) => String(option.value));

      const list = toSlotList(assignColourSlots(slots, next));
      setSearchParams({ [PARAM_COLLECTIONS]: list.join(",") });
    },
    [slots, setSearchParams],
  );

  const handleDragSelect = useCallback(
    (startIndex: number, endIndex: number) => {
      const to = servedTo(entries);
      if (!to) return;

      const next = rangeFromBins(binStarts, startIndex, endIndex, bin, to);
      if (next) handleSelectRange(next);
    },
    [entries, binStarts, bin, handleSelectRange],
  );

  const atCapacity = plotted.length >= MAX_PLOTTED_COLLECTIONS;

  return (
    <Stack spacing={2} sx={{ minWidth: 0 }}>
      <TelemetryRangeCard telemetry={telemetry} hint={DRAG_HINT} />

      {validationMessage && (
        <Alert severity="warning">{validationMessage}</Alert>
      )}

      <SectionCard
        title="Host polling across collections"
        summary={`${plotted.length} of ${rows.length} collections`}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, flexWrap: "wrap", alignItems: "flex-start" }}
        >
          <FormMultiSelect
            multiple
            label="Collections"
            placeholder="Choose collections to plot"
            options={options}
            value={selectedOptions}
            onChange={handleCollectionsChange}
            noOptionsText="No collections to plot"
          />

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Task type
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={taskTypeFilter}
              onChange={(_, value) =>
                isTaskTypeFilter(value) &&
                setSearchParams({ [PARAM_TASK_TYPE]: value })
              }
            >
              {(["a", "b", "both"] as TaskTypeFilter[]).map((value) => (
                <ToggleButton key={value} value={value}>
                  {TASK_TYPE_LABELS[value]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        {atCapacity && (
          <Typography
            variant="caption"
            color="text.secondary"
            component="div"
            sx={{ mb: 2 }}
          >
            At the {MAX_PLOTTED_COLLECTIONS}-collection limit, so each keeps a
            distinct colour. Deselect one to swap another in.
          </Typography>
        )}

        {failedPids.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not load polling history for{" "}
            {failedPids.map((pid) => nameByPid[pid] ?? pid).join(", ")}. The
            rest are plotted below.
          </Alert>
        )}

        <MultiSeriesLineChart
          labels={labels}
          series={series}
          yAxisLabel={Y_AXIS_LABEL}
          height={CHART_HEIGHT}
          hideLegend
          isLoading={isQueryValid && isLoading}
          isEmpty={!series.length}
          emptyContent={
            <Typography variant="caption" color="text.secondary">
              {plotted.length === 0
                ? "Choose at least one collection to plot."
                : "None of the selected collections have polling history in this range."}
            </Typography>
          }
          onSelectRange={handleDragSelect}
          footer={
            legendEntries.length > 0 && (
              <ChartLegend
                entries={legendEntries}
                solidLabel="A-type"
                dashedLabel="B-type"
              />
            )
          }
        />
      </SectionCard>
    </Stack>
  );
};

export default AggregateTelemetry;
