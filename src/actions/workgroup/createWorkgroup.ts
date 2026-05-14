"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Workgroup, CreateWorkgroupPost, ApiResponse } from "@/types/api";
import { revalidateAction } from "@/actions/revalidate";
import { TAG_WORKGROUP_ADMIN } from "@/config/tags";

const createWorkgroup = async (payload: CreateWorkgroupPost): Promise<Workgroup> => {
  const { data } = await apiPost<ApiResponse<Workgroup>, CreateWorkgroupPost>(
    API_ROUTES.workgroups,
    payload,
  );
  await revalidateAction(TAG_WORKGROUP_ADMIN);
  return data;
};

export default createWorkgroup;
