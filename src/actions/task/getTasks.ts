"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Tasks, ApiResponse, ReadArgs } from "@/types/api";

const getTasks = async (args?: ReadArgs): Promise<ApiResponse<Tasks>> => {
  return await apiGet<ApiResponse<Tasks>>({
    url: API_ROUTES.tasks,
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getTasks;
