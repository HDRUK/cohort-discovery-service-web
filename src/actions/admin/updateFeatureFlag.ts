"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { revalidateAction } from "@/actions/revalidate";
import { TAG_FEATURE_FLAGS } from "@/config/tags";

export interface UpdateFeatureFlagPayload {
  enabled: boolean;
}

const updateFeatureFlag = async (
  name: string,
  payload: UpdateFeatureFlagPayload,
): Promise<void> => {
  await apiPut<ApiResponse<unknown>, UpdateFeatureFlagPayload>(
    API_ROUTES.feature(name),
    payload,
  );
  await revalidateAction(TAG_FEATURE_FLAGS);
};

export default updateFeatureFlag;
