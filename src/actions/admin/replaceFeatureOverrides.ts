"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { FeatureOverridesUpdate } from "@/types/features";

const replaceFeatureOverrides = async (
  name: string,
  payload: FeatureOverridesUpdate,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<unknown>, FeatureOverridesUpdate>(
    token,
    API_ROUTES.featureOverridesFor(name),
    payload,
  );
  updateTag(CACHE_TAGS.features);
};

export default replaceFeatureOverrides;
