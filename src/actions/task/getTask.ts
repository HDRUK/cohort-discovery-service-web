"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Task, ApiResponse, ReadArgs } from "@/types/api";

const getTask = async (
  pid: string,
  args?: ReadArgs,
): Promise<ApiResponse<Task>> => {
  return await apiGet<ApiResponse<Task>>({
    url: API_ROUTES.getTask(pid),
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getTask;
