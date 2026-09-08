import { Chip } from "@mui/material";
import { TaskHistoryStatus } from "@/types/api";

const STATUS: Record<
  TaskHistoryStatus,
  { label: string; color: "success" | "error" | "info" | "default" }
> = {
  succeeded: { label: "Succeeded", color: "success" },
  failed: { label: "Failed", color: "error" },
  in_flight: { label: "In flight", color: "info" },
  pending: { label: "Pending", color: "default" },
};

const TaskStatusChip = ({ status }: { status: TaskHistoryStatus }) => {
  const { label, color } = STATUS[status] ?? {
    label: status,
    color: "default" as const,
  };

  return <Chip size="small" variant="outlined" color={color} label={label} />;
};

export default TaskStatusChip;
