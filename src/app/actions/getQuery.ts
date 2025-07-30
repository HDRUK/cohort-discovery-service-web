"use server";

import apiClient, { handleApiError } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (pid: string): Promise<ApiResponse<Query>> => {
  try {
    const response = await apiClient.get<ApiResponse<Query>>(
      API_ROUTES.getQuery(pid)
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default getQuery;
