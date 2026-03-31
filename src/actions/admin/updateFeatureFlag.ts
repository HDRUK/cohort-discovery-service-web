"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

export interface UpdateFeatureFlagPayload {
  enabled: boolean;
}

const updateFeatureFlag = async (
  name: string,
  payload: UpdateFeatureFlagPayload,
): Promise<ApiResponse<unknown>> => {
  const res = await apiPut<ApiResponse<unknown>, UpdateFeatureFlagPayload>(
    API_ROUTES.feature(name),
    payload,
  );
  console.log(res.data);

  return res;
};

export default updateFeatureFlag;
