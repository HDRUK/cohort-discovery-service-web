"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Task, ApiResponse } from "@/types/api";

const getTask = async (
  pid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Task>> => {
  return await apiGet<ApiResponse<Task>>({
    url: API_ROUTES.getTask(pid),
    ...args,
  });
};

export default getTask;
