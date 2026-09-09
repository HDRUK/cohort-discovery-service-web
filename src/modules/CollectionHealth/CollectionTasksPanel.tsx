"use client";

import { useMemo, useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Skeleton,
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
import TaskDetailModal from "./TaskDetailModal";
import TaskStatusChip from "./TaskStatusChip";
import { groupByTaskType } from "./taskSeries";
import { countMissingText, filterTasks } from "./taskTable";
import { useSeriesColours } from "./telemetryChart";
import useQueryDefinitions from "./useQueryDefinitions";

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
  });

  const history = data?.data;
  const tasks = useMemo(() => history?.tasks.data ?? [], [history]);
  const omitted = (history?.tasks.total ?? 0) - tasks.length;

  const {
    textByPid,
    isLoading: isLoadingText,
    cappedAt,
  } = useQueryDefinitions(tasks, isActive);

  const rows = useMemo(
    () => filterTasks(tasks, debouncedSearchTerm ?? "", textByPid),
    [tasks, debouncedSearchTerm, textByPid],
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

  const missingText = useMemo(
    () => countMissingText(tasks, textByPid),
    [tasks, textByPid],
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
            return isLoadingText ? (
              <Skeleton variant="text" width={220} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Not loaded
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
    [colourByType, isLoadingText, textByPid],
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
        isActive && !isError
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

      {isActive && isError && (
        <Alert severity="error">
          Could not load tasks for this collection.
        </Alert>
      )}

      {isActive && !isError && (
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
            {cappedAt !== null && (
              <Typography variant="caption" color="warning.main">
                Query text loaded for the first {cappedAt} distinct queries
                only; search cannot match the rest.
              </Typography>
            )}
            {cappedAt === null && missingText > 0 && !isLoadingText && (
              <Typography variant="caption" color="text.secondary">
                {missingText} task(s) have no query text loaded, so search
                cannot match them.
              </Typography>
            )}
          </Stack>

          <Table table={table} emptyMessage="No tasks match this search" />
        </Box>
      )}

      {openTask && (
        <TaskDetailModal
          open
          onClose={() => setOpenTask(null)}
          binLabel=""
          typeLabel=""
          title={openTask.query?.name ?? openTask.pid}
          tasks={[openTask]}
        />
      )}
    </SectionCard>
  );
};

export default CollectionTasksPanel;
