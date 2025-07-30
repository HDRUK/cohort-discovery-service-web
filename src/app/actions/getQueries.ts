"use server";

import apiClient, { handleApiError } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQueries = async (): Promise<ApiResponse<Query[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Query[]>>(
      API_ROUTES.queries
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default getQueries;
