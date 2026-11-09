import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse } from "@/types/api";
import { FeatureFlag } from "@/types/features";

export const getFeatureFlags = async (): Promise<ApiResponse<FeatureFlag>> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<FeatureFlag>>(token, API_ROUTES.featureFlags);
};
