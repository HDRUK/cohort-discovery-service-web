"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Query } from "@/types/api";

interface DeleteQueriesPost {
  keys: string[];
}

const deleteQueries = async (pids: string[]): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  const res = await apiPost<ApiResponse<Query>, DeleteQueriesPost>(
    token,
    API_ROUTES.deleteQueriesBulk,
    {
      keys: pids,
    },
  );
  refresh();
  return res;
};

export default deleteQueries;
