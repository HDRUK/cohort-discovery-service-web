import { Query } from "@/types/api";
import { QueryStatus } from "@/types/queries";
import { getTaskStatus } from "./tasks";
import { TaskStatus } from "@/types/tasks";

const getQueryName = (query: Query, short = false) =>
  query.name ?? (short ? query.pid.split("-")[0] : query.pid);

const getQueryStatus = (query: Query): QueryStatus => {
  const tasks = query.tasks;

  if (tasks.length === 0) return QueryStatus.INVALID;

  const statuses = tasks.map(getTaskStatus);

  if (statuses.some((s) => s === TaskStatus.PENDING)) {
    return QueryStatus.PENDING;
  }

  if (statuses.every((s) => s === TaskStatus.SUCCESSFUL)) {
    return QueryStatus.SUCCESSFUL;
  }

  if (statuses.every((s) => s === TaskStatus.ERROR)) {
    return QueryStatus.ERROR;
  }

  return QueryStatus.PARTIAL_RESULTS;
};

export { getQueryName, getQueryStatus };
