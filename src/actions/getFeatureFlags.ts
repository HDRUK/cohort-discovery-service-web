"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { FeatureFlag, ApiResponse } from "../types/api";

const getFeatureFlags = async (): Promise<ApiResponse<FeatureFlag>> => {
  return await apiGet<ApiResponse<FeatureFlag>>(API_ROUTES.featureFlags, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["feature-flags"] },
    cache: "force-cache",
  });
};

export default getFeatureFlags;
