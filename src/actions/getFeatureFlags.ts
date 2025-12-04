"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { FeatureFlag, ApiResponse } from "../types/api";

const getFeatureFlags = async (): Promise<ApiResponse<FeatureFlag[]>> => {
  return await apiGet<ApiResponse<FeatureFlag[]>>(API_ROUTES.featureFlags, {
    next: { revalidate: 3600, tags: ["feature-flags"] },
    cache: "force-cache",
  });
}

export default getFeatureFlags;