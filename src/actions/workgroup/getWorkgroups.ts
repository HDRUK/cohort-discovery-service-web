"use server";

import { TAG_WORKGROUP_ADMIN } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Workgroup, ReadArgs } from "@/types/api";

const getWorkgroups = async (
  args?: ReadArgs,
): Promise<ApiResponse<Workgroup[]>> => {
  return await apiGet<ApiResponse<Workgroup[]>>({
    url: API_ROUTES.workgroups,
    tags: [TAG_WORKGROUP_ADMIN],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getWorkgroups;
