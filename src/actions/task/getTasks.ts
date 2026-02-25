"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Tasks, ApiResponse } from "@/types/api";

const getTasks = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Tasks>> => {
  return await apiGet<ApiResponse<Tasks>>({ url: API_ROUTES.tasks, ...args });
};

export default getTasks;
