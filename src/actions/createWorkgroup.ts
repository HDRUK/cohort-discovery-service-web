"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Workgroup, CreateWorkgroupPost, ApiResponse } from "../types/api";

const createWorkgroup = async (
  payload: CreateWorkgroupPost,
): Promise<ApiResponse<Workgroup>> => {
  return await apiPost<ApiResponse<Workgroup>, CreateWorkgroupPost>(
    API_ROUTES.adminWorkgroups,
    payload,
  );
};

export default createWorkgroup;
