"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Task, ApiResponse } from "../types/api";

const rerunTask = async (pid: string): Promise<ApiResponse<Task>> => {
  return await apiGet<ApiResponse<Task>>(API_ROUTES.rerunTask(pid));
};

export default rerunTask;
