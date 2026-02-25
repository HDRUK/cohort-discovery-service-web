"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Query } from "@/types/api";

interface DeleteQueriesPost {
  keys: string[];
}

const deleteQueries = async (pids: string[]): Promise<ApiResponse<Query>> => {
  return await apiPost<ApiResponse<Query>, DeleteQueriesPost>(
    API_ROUTES.deleteQueriesBulk,
    {
      keys: pids,
    },
  );
};

export default deleteQueries;
