"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

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
    payload,
  );
  refresh();
};

export default updateFeatureFlag;
