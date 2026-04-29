"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Query } from "@/types/api";
import { revalidateUserAction } from "../revalidate";
import { TAG_QUERIES } from "@/config/tags";

interface DeleteQueriesPost {
  keys: string[];
}

const deleteQueries = async (pids: string[]): Promise<ApiResponse<Query>> => {
  const res = await apiPost<ApiResponse<Query>, DeleteQueriesPost>(
    API_ROUTES.deleteQueriesBulk,
    {
      keys: pids,
    },
  );
  revalidateUserAction(TAG_QUERIES);
  return res;
};

export default deleteQueries;
