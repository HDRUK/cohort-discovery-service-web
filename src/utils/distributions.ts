import { Task } from "@/types/api";

export const isEqualTask = (task?: Task, lastSuccessfullTask?: Task) => {
  if (!task || !lastSuccessfullTask) return false;
  return task.id === lastSuccessfullTask.id;
};
