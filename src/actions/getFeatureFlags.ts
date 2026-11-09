"use server";

import { TAG_FEATURE_FLAGS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, ReadArgs } from "@/types/api";
import { FeatureFlag } from "@/types/features";

const getFeatureFlags = async (
  args?: ReadArgs,
): Promise<ApiResponse<FeatureFlag>> => {
  return await apiGet<ApiResponse<FeatureFlag>>({
    url: API_ROUTES.featureFlags,
    tags: [TAG_FEATURE_FLAGS],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getFeatureFlags;
