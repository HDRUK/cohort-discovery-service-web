"use client";

import { useMemo, useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { MRT_ColumnDef } from "material-react-table";
import getCollectionTaskHistory from "@/actions/collection/getCollectionTaskHistory";
import SearchBox from "@/components/SearchBox";
import SectionCard from "@/components/SectionCard";
import Table from "@/components/Table";
import { getTagsCollectionTaskHistory } from "@/config/tags";
import { useDebounce } from "@/hooks/useDebounce";
import { useTable } from "@/hooks/useTable";
import { TaskHistoryTask, TimeRange } from "@/types/api";
import { formatDuration, getDatetime, getTimestamp } from "@/utils/date";
import { queryToText } from "@/utils/queryBuilder";
import TaskDetailModal from "./TaskDetailModal";
import TaskStatusChip from "./TaskStatusChip";
import { groupByTaskType } from "./taskSeries";
import { filterTasks } from "./taskTable";
import { STALE_TIME_TELEMETRY, useSeriesColours } from "./telemetryChart";

const NO_VALUE = "—";

interface CollectionTasksPanelProps {
  collectionPid: string;
  range: TimeRange;
  enabled: boolean;
  sx?: SxProps<Theme>;
}

const CollectionTasksPanel = ({
  collectionPid,
  range,
  enabled,
  sx,
}: CollectionTasksPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openTask, setOpenTask] = useState<TaskHistoryTask | null>(null);

  const { debounced: debouncedSearchTerm } = useDebounce(searchTerm, {});
  const seriesColours = useSeriesColours();

  const isActive = enabled;

  const { data, isLoading, isError } = useQuery({
    queryKey: getTagsCollectionTaskHistory(collectionPid, range),
    queryFn: () => getCollectionTaskHistory(collectionPid, range),
    enabled: isActive,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: STALE_TIME_TELEMETRY,
  });

  const history = data?.data;
  const hasFailed = isError || !!data?.error;
  const tasks = useMemo(() => history?.tasks.data ?? [], [history]);
  const omitted = (history?.tasks.total ?? 0) - tasks.length;

  const textByPid = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(history?.definitionsByPid ?? {}).map(
          ([pid, definition]) => [pid, queryToText(definition)],
        ),
      ),
    [history],
  );

  const term = debouncedSearchTerm ?? "";

  const rows = useMemo(
    () => filterTasks(tasks, term, textByPid),
    [tasks, term, textByPid],
  );

  const colourByType = useMemo(
    () =>
      Object.fromEntries(
        [...groupByTaskType(tasks)].map(([type], index) => [
          type,
          seriesColours[index % seriesColours.length],
        ]),
      ),
    [tasks, seriesColours],
  );

  const columns = useMemo<MRT_ColumnDef<TaskHistoryTask>[]>(
    () => [
      {
        id: "task_type",
        header: "Type",
        size: 90,
        accessorFn: (task) => task.task_type,
        Cell: ({ row }) => (
          <Tooltip
            title={
              row.original.task_type === "b"
                ? "B-type — a distribution job, which runs no cohort query"
                : "A-type — a cohort query"
            }
          >
            <Chip
              size="small"
              variant="outlined"
              label={`${row.original.task_type.toUpperCase()}-type`}
              sx={{
                borderColor: colourByType[row.original.task_type],
                color: colourByType[row.original.task_type],
              }}
            />
          </Tooltip>
        ),
      },
      {
        id: "name",
        header: "Name",
        size: 180,
        accessorFn: (task) => task.query?.name ?? "",
        Cell: ({ row }) => (
          <Typography variant="body2" noWrap>
            {row.original.query?.name ?? NO_VALUE}
          </Typography>
        ),
      },
      {
        id: "query",
        header: "Query",
        size: 320,
        accessorFn: (task) =>
          task.query?.pid ? (textByPid[task.query.pid] ?? "") : "",
        Cell: ({ row }) => {
          const pid = row.original.query?.pid;
          if (!pid) {
            return (
              <Typography variant="caption" color="text.secondary">
                {NO_VALUE}
              </Typography>
            );
          }

          const text = textByPid[pid];
          if (!text) {
            return (
              <Typography variant="caption" color="text.secondary">
                {NO_VALUE}
              </Typography>
            );
          }

          return (
            <Tooltip title={text}>
              <Typography variant="caption">{text}</Typography>
            </Tooltip>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        size: 120,
        accessorFn: (task) => task.status,
        Cell: ({ row }) => <TaskStatusChip status={row.original.status} />,
      },
      {
        id: "created_at",
        header: "Submitted",
        size: 150,
        accessorFn: (task) => getTimestamp(task.created_at),
        Cell: ({ row }) => (
          <Typography variant="caption">
            {getDatetime(row.original.created_at)}
          </Typography>
        ),
      },
      {
        id: "attempted_at",
        header: "Ran",
        size: 150,
        accessorFn: (task) => getTimestamp(task.attempted_at ?? undefined),
        Cell: ({ row }) => (
          <Typography variant="caption">
            {row.original.attempted_at
              ? getDatetime(row.original.attempted_at)
              : NO_VALUE}
          </Typography>
        ),
      },
      {
        id: "duration_ms",
        header: "Duration",
        size: 100,
        accessorFn: (task) => task.duration_ms ?? -1,
        Cell: ({ row }) => (
          <Typography variant="caption">
            {formatDuration(row.original.duration_ms)}
          </Typography>
        ),
      },
      {
        id: "json",
        header: "",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Open this task, with its query definition as JSON">
            <IconButton size="small" onClick={() => setOpenTask(row.original)}>
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [colourByType, textByPid],
  );

  const table = useTable({
    data: rows,
    columns,
    getRowId: (task) => task?.pid ?? "",
    enableRowSelection: false,
    enableSorting: true,
    layoutMode: "grid",
    initialState: {
      density: "compact",
      sorting: [{ id: "created_at", desc: true }],
    },
    state: { isLoading: isActive && isLoading },
  });

  return (
    <SectionCard
      title="All tasks"
      sx={sx}
      collapsible
      defaultExpanded
      summary={
        isActive && !hasFailed
          ? `${rows.length.toLocaleString()} of ${tasks.length.toLocaleString()}`
          : undefined
      }
      action={
        <SearchBox
          size="small"
          collapsible={false}
          placeholder="Search the query"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          inputBgColor="background.default"
        />
      }
    >
      {!enabled && (
        <Typography variant="caption" color="text.secondary">
          Choose a valid time range to load tasks.
        </Typography>
      )}

      {isActive && hasFailed && (
        <Alert severity="error">
          Could not load tasks for this collection.
        </Alert>
      )}

      {isActive && !hasFailed && (
        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1, flexWrap: "wrap" }}
          >
            <Chip
              size="small"
              variant="outlined"
              label={`${rows.length.toLocaleString()} of ${tasks.length.toLocaleString()} shown`}
            />
            {omitted > 0 && (
              <Typography variant="caption" color="warning.main">
                Range holds {history?.tasks.total.toLocaleString()} tasks — only
                the most recent {tasks.length.toLocaleString()} were loaded.
              </Typography>
            )}
          </Stack>

          <Table
            table={table}
            emptyMessage={
              term
                ? `No tasks match “${term}”.`
                : `No tasks ran on this collection between ${getDatetime(range.from)} and ${getDatetime(range.to)}.`
            }
          />
        </Box>
      )}

      {openTask && (
        <TaskDetailModal
          open
          onClose={() => setOpenTask(null)}
          title={openTask.query?.name ?? openTask.pid}
          tasks={[openTask]}
          definitionsByPid={history?.definitionsByPid ?? {}}
        />
      )}
    </SectionCard>
  );
};

export default CollectionTasksPanel;
