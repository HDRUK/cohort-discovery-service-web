"use server";

import { getTask as readTask } from "@/server/data/tasks";
import { ApiResponse, Task } from "@/types/api";

const getTask = async (pid: string): Promise<ApiResponse<Task>> =>
  readTask(pid);

export default getTask;
