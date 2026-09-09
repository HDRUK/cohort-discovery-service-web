import { TaskHistoryTask } from "@/types/api";

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
