"use server";

import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Query } from "@/types/api";

const deleteQuery = async (pid: string): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  return await apiDelete<ApiResponse<Query>>(token, API_ROUTES.getQuery(pid));
};

export default deleteQuery;
