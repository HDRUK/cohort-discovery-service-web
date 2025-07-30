"use server";

import apiClient, { handleApiError } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<Collection[]>>(
      API_ROUTES.collections
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default getCollections;
