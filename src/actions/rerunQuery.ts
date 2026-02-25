"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CreateQuery, ApiResponse } from "@/types/api";

const rerunQuery = async (pid: string): Promise<ApiResponse<CreateQuery>> => {
  return await apiGet<ApiResponse<CreateQuery>>({
    url: API_ROUTES.rerunQuery(pid),
    cacheOptions: { useCache: false },
  });
};

export default rerunQuery;
