import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse, Workgroup } from "@/types/api";

export const getWorkgroups = async (): Promise<ApiResponse<Workgroup[]>> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);
  cacheTag(CACHE_TAGS.workgroups);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Workgroup[]>>(token, API_ROUTES.workgroups);
};
