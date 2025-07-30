"use server";

import apiClient, { handleApiError } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Tasks, ApiResponse } from "../types/api";

const getTasks = async (): Promise<ApiResponse<Tasks>> => {
  try {
    const response = await apiClient.get<ApiResponse<Tasks>>(API_ROUTES.tasks);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default getTasks;
