"use server";

import { TAG_WORKGROUP_ADMIN } from "@/config/tags";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Workgroup } from "@/types/api";

const getAdminWorkgroups = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Workgroup[]>> => {
  return await apiGet<ApiResponse<Workgroup[]>>({
    url: API_ROUTES.adminWorkgroups,
    tags: [TAG_WORKGROUP_ADMIN],
    ...args,
  });
};

export default getAdminWorkgroups;
