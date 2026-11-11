"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Workgroup, CreateWorkgroupPost, ApiResponse } from "@/types/api";

const createWorkgroup = async (
  payload: CreateWorkgroupPost,
): Promise<Workgroup> => {
  const { token } = await requireSession();
  const { data } = await apiPost<ApiResponse<Workgroup>, CreateWorkgroupPost>(
    token,
    API_ROUTES.workgroups,
    payload,
  );
  refresh();
  return data;
};

export default createWorkgroup;
