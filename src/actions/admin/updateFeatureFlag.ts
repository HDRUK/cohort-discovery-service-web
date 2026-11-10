"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { pick } from "@/utils/pick";

const FEATURE_FLAG_FIELDS = ["enabled"] as const;

export interface UpdateFeatureFlagPayload {
  enabled: boolean;
}

const updateFeatureFlag = async (
  name: string,
  payload: UpdateFeatureFlagPayload,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<unknown>, UpdateFeatureFlagPayload>(
    token,
    API_ROUTES.feature(name),
    pick(payload, FEATURE_FLAG_FIELDS),
  );
  refresh();
};

export default updateFeatureFlag;
