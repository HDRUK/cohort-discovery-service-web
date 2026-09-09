import { TaskHistoryTask } from "@/types/api";

export const MAX_QUERY_DEFINITIONS = 50;

export const distinctQueryPids = (tasks: TaskHistoryTask[]): string[] => [
  ...new Set(
    tasks.map((task) => task.query?.pid).filter((pid): pid is string => !!pid),
  ),
];

export const filterTasks = (
  tasks: TaskHistoryTask[],
  term: string,
  textByPid: Record<string, string | undefined>,
): TaskHistoryTask[] => {
  const needle = term.trim().toLowerCase();
  if (!needle) return tasks;

  return tasks.filter((task) => {
    const pid = task.query?.pid;
    const haystack = [task.query?.name, pid ? textByPid[pid] : undefined];

    return haystack.some((value) => value?.toLowerCase().includes(needle));
  });
};

export const countMissingText = (
  tasks: TaskHistoryTask[],
  textByPid: Record<string, string | undefined>,
): number =>
  tasks.filter((task) => {
    const pid = task.query?.pid;
    return !!pid && !textByPid[pid];
  }).length;
