"use server";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { Query, ApiResponse } from "@/types/api";

const getLatestQuery = async (): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Query>>(token, `${API_ROUTES.queries}/latest`);
};

export default getLatestQuery;
