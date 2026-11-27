import { RecordCounts, Task } from "@/types/api";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getRecordCounts = (metadata: unknown): RecordCounts => {
  if (!isObject(metadata) || !isObject(metadata.record_counts)) {
    return {};
  }

  const { specimen } = metadata.record_counts;

  return typeof specimen === "number" ? { specimen } : {};
};

export const getSpecimenCount = (task: Task): number | null => {
  if (task.failed_at || !task.result || task.result.status === "error") {
    return null;
  }

  return getRecordCounts(task.result.metadata).specimen ?? null;
};

export const hasSpecimenCounts = (tasks: Task[]): boolean =>
  tasks.some((task) => getSpecimenCount(task) !== null);
