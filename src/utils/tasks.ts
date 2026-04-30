import { Task } from "@/types/api";
import { TaskStatus } from "@/types/tasks";

export const getTaskStatus = (task: Task): TaskStatus => {
  const hasAttempts = Array.isArray(task.attempts)
    ? task.attempts.length > 0
    : task.attempts > 0;

  const isCompleted = task.completed_at !== null;
  const isFailed = task.failed_at !== null;

  if (isCompleted && isFailed) {
    return TaskStatus.ERROR;
  }

  if (!hasAttempts && !isCompleted) {
    return TaskStatus.PENDING;
  }

  if (hasAttempts && isCompleted && !isFailed) {
    return TaskStatus.SUCCESSFUL;
  }

  return TaskStatus.PENDING;
};

export const getTotalAllTasks = (tasks: Task[]) => {
  if (tasks.every((t) => t.failed_at !== null)) return "-";

  const count = tasks
    .filter((t) => t.completed_at !== null)
    .filter((t) => t.failed_at === null)
    .filter((t) => !!t.result)
    .reduce((sum, t) => sum + (t.result?.count || 0), 0);
  return count;
};
