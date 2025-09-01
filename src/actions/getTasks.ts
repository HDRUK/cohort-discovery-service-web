"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Tasks, ApiResponse } from "../types/api";

const getTasks = async (): Promise<ApiResponse<Tasks>> => {
  return await apiGet<ApiResponse<Tasks>>(API_ROUTES.tasks);
};

export default getTasks;
