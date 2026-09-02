"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getQuery from "@/actions/query/getQuery";
import Modal from "@/components/Modal";
import { TaskHistoryRun, TaskHistoryTask } from "@/types/api";
import { getDatetime } from "@/utils/date";
import { queryToText } from "@/utils/queryBuilder";
import { formatDuration, NO_VALUE } from "./taskHistory";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ minWidth: 110, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="caption" sx={{ wordBreak: "break-all" }}>
      {value ?? NO_VALUE}
    </Typography>
  </Box>
);

/**
 * The query the task ran, in prose. Fetched on open rather than with the task
 * list — a range holds hundreds of tasks and only the opened one needs its
 * definition. B-type tasks are distributions and carry no query at all.
 */
const QuerySummary = ({ task }: { task: TaskHistoryTask }) => {
  const queryPid = task.query?.pid ?? null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["query", queryPid],
    queryFn: () => getQuery(queryPid as string),
    enabled: queryPid !== null,
    refetchOnWindowFocus: false,
  });

  if (!queryPid) {
    return (
      <Typography variant="caption" color="text.secondary">
        This task has no query — {task.task_type}-type tasks run distributions
        rather than a cohort definition.
      </Typography>
    );
  }

  const definition = data?.data?.definition;

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2">
        {task.query?.name ?? queryPid}
      </Typography>

      {isLoading && <Skeleton variant="text" height={48} />}

      {isError && (
        <Alert severity="error">
          Could not load the definition for this query.
        </Alert>
      )}

      {definition && (
        <Typography variant="body2">{queryToText(definition)}</Typography>
      )}

      <DetailRow label="Query PID" value={queryPid} />
    </Stack>
  );
};

const RunBlock = ({ run }: { run: TaskHistoryRun }) => (
  <Stack spacing={0.25}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2">Attempt {run.attempt}</Typography>
      <Chip
        label={run.result_status ?? run.error_class ?? "unsettled"}
        size="small"
        variant="outlined"
        color={run.error_class ? "error" : "default"}
      />
      <Typography variant="caption" color="text.secondary">
        {formatDuration(run.duration_ms)}
      </Typography>
    </Box>
    <DetailRow label="Worker" value={run.worker_id} />
    <DetailRow
      label="Claimed"
      value={getDatetime(run.claimed_at ?? undefined)}
    />
    <DetailRow
      label="Started"
      value={getDatetime(run.started_at ?? undefined)}
    />
    <DetailRow
      label="Finished"
      value={getDatetime(run.finished_at ?? undefined)}
    />
    {run.error_message && <DetailRow label="Error" value={run.error_message} />}
  </Stack>
);

const TaskDetail = ({ task }: { task: TaskHistoryTask }) => (
  <Stack spacing={2}>
    <QuerySummary task={task} />

    <Divider />

    <Stack spacing={0.25}>
      <DetailRow label="Task PID" value={task.pid} />
      <DetailRow label="Type" value={task.task_type} />
      <DetailRow label="Status" value={task.status} />
      <DetailRow label="Attempts" value={String(task.attempts)} />
      <DetailRow label="Created" value={getDatetime(task.created_at)} />
      <DetailRow
        label="First claimed"
        value={getDatetime(task.attempted_at ?? undefined)}
      />
      <DetailRow
        label="Completed"
        value={getDatetime(task.completed_at ?? undefined)}
      />
      <DetailRow
        label="Failed"
        value={getDatetime(task.failed_at ?? undefined)}
      />
      <DetailRow
        label="Queued for"
        value={formatDuration(task.queued_for_ms)}
      />
      <DetailRow label="Duration" value={formatDuration(task.duration_ms)} />
      <DetailRow
        label="All attempts"
        value={formatDuration(task.total_duration_ms)}
      />
    </Stack>

    <Divider />

    <Stack spacing={1.5}>
      {task.runs.map((run) => (
        <RunBlock key={run.attempt} run={run} />
      ))}
      {task.runs.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          No run has been claimed for this task yet.
        </Typography>
      )}
    </Stack>
  </Stack>
);

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  binLabel: string;
  typeLabel: string;
  tasks: TaskHistoryTask[];
}

/**
 * What ran in one bin. A bin holding a single task opens straight to its
 * detail; anything wider needs picking from first.
 */
const TaskDetailModal = ({
  open,
  onClose,
  binLabel,
  typeLabel,
  tasks,
}: TaskDetailModalProps) => {
  const [selectedPid, setSelectedPid] = useState<string | null>(null);

  // The picked task, or the only one there is — a lone task needs no picking.
  const picked = tasks.find((task) => task.pid === selectedPid) ?? null;
  const selected = picked ?? (tasks.length === 1 ? tasks[0] : null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${typeLabel} · ${binLabel}`}
      maxWidth="md"
      secondaryActionLabel={picked ? "Back to list" : undefined}
      onSecondaryAction={picked ? () => setSelectedPid(null) : undefined}
    >
      {selected ? (
        <TaskDetail task={selected} />
      ) : (
        <List disablePadding>
          {tasks.map((task) => (
            <ListItemButton
              key={task.pid}
              onClick={() => setSelectedPid(task.pid)}
            >
              <ListItemText
                primary={task.query?.name ?? task.pid}
                secondary={`${task.status} · ${formatDuration(task.duration_ms)} · ${getDatetime(task.created_at)}`}
                slotProps={{
                  primary: { variant: "body2" },
                  secondary: { variant: "caption" },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
