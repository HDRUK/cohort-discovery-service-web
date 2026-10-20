"use client";

import { useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import NotesIcon from "@mui/icons-material/Notes";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CodeBlock from "@/components/CodeBlock";
import DetailRow from "@/components/DetailRow";
import Modal from "@/components/Modal";
import { TaskHistoryRun, TaskHistoryTask } from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import { formatDuration, getDatetime } from "@/utils/date";
import { queryToText } from "@/utils/queryBuilder";

const QuerySummary = ({
  task,
  definition,
}: {
  task: TaskHistoryTask;
  definition?: RuleGroupType;
}) => {
  const queryPid = task.query?.pid ?? null;
  const [showJson, setShowJson] = useState(false);

  if (!queryPid) {
    return (
      <Typography variant="caption" color="text.secondary">
        This task has no query — {task.task_type}-type tasks run distributions
        rather than a cohort definition.
      </Typography>
    );
  }

  return (
    <Stack spacing={0.5}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle2" sx={{ minWidth: 0 }} noWrap>
          {task.query?.name ?? queryPid}
        </Typography>
        <Tooltip
          title={
            showJson
              ? "Show the plain-text translation"
              : "Show the full query definition JSON"
          }
        >
          <span>
            <IconButton
              size="small"
              disabled={!definition}
              aria-label={showJson ? "Show text" : "Show JSON"}
              onClick={() => setShowJson((current) => !current)}
            >
              {showJson ? (
                <NotesIcon fontSize="small" />
              ) : (
                <CodeIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {definition ? (
        showJson ? (
          <CodeBlock code={definition} />
        ) : (
          <Typography variant="body2">{queryToText(definition)}</Typography>
        )
      ) : (
        <Typography variant="caption" color="text.secondary">
          This query’s definition was not returned with the task history — it
          may have been deleted since the task ran.
        </Typography>
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

const TaskDetail = ({
  task,
  definition,
}: {
  task: TaskHistoryTask;
  definition?: RuleGroupType;
}) => (
  <Stack spacing={2}>
    <QuerySummary task={task} definition={definition} />

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
  tasks: TaskHistoryTask[];
  definitionsByPid: Record<string, RuleGroupType>;
  title?: string;
  binLabel?: string;
  typeLabel?: string;
}

const TaskDetailModal = ({
  open,
  onClose,
  tasks,
  definitionsByPid,
  title,
  binLabel,
  typeLabel,
}: TaskDetailModalProps) => {
  const [selectedPid, setSelectedPid] = useState<string | null>(null);

  const picked = tasks.find((task) => task.pid === selectedPid) ?? null;
  const selected = picked ?? (tasks.length === 1 ? tasks[0] : null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? [typeLabel, binLabel].filter(Boolean).join(" · ")}
      maxWidth="md"
      secondaryActionLabel={picked ? "Back to list" : undefined}
      onSecondaryAction={picked ? () => setSelectedPid(null) : undefined}
    >
      {selected ? (
        <TaskDetail
          task={selected}
          definition={
            selected.query ? definitionsByPid[selected.query.pid] : undefined
          }
        />
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
