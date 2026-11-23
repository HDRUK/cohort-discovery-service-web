"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { FeatureOverrideSubject } from "@/types/features";

export interface SetFeatureOverridePayload {
  enabled: boolean;
}

const setFeatureOverride = async (
  name: string,
  subject: FeatureOverrideSubject,
  id: number,
  payload: SetFeatureOverridePayload,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<unknown>, SetFeatureOverridePayload>(
    token,
    API_ROUTES.featureOverride(name, subject, id),
    payload,
  );
  updateTag(CACHE_TAGS.features);
};

export default setFeatureOverride;
