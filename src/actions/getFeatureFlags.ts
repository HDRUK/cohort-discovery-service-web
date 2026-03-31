"use server";

import { TAG_FEATURE_FLAGS } from "@/config/tags";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { FeatureFlag, ApiResponse } from "@/types/api";

const getFeatureFlags = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<FeatureFlag>> => {
  return await apiGet<ApiResponse<FeatureFlag>>({
    url: API_ROUTES.featureFlags,
    tags: [TAG_FEATURE_FLAGS],
    ...args,
  });
};

export default getFeatureFlags;
