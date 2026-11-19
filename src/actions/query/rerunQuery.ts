"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { CreateQuery, ApiResponse } from "@/types/api";
import { changesQueryQuota } from "@/utils/queryLimit";

const rerunQuery = async (pid: string): Promise<ApiResponse<CreateQuery>> => {
  const { token } = await requireSession();
  const res = await apiGet<ApiResponse<CreateQuery>>(
    token,
    API_ROUTES.rerunQuery(pid),
    { errorMode: ErrorMode.RESULT },
  );
  if (changesQueryQuota(res)) updateTag(CACHE_TAGS.currentUser);
  return res;
};

export default rerunQuery;
