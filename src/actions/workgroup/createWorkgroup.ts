"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
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
  updateTag(CACHE_TAGS.workgroups);
  return data;
};

export default createWorkgroup;
