"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Workgroup, CreateWorkgroupPost, ApiResponse } from "@/types/api";
import { pick } from "@/utils/pick";

const WORKGROUP_FIELDS = ["name", "active"] as const;

const createWorkgroup = async (
  payload: CreateWorkgroupPost,
): Promise<Workgroup> => {
  const { token } = await requireSession();
  const { data } = await apiPost<ApiResponse<Workgroup>, CreateWorkgroupPost>(
    token,
    API_ROUTES.workgroups,
    pick(payload, WORKGROUP_FIELDS),
  );
  refresh();
  return data;
};

export default createWorkgroup;
