"use server";

import { getFeatureFlags as readFeatureFlags } from "@/server/data/features";
import { ApiResponse } from "@/types/api";
import { FeatureFlag } from "@/types/features";

const getFeatureFlags = async (): Promise<ApiResponse<FeatureFlag>> =>
  readFeatureFlags();

export default getFeatureFlags;
