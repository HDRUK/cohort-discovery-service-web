"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { FeatureOverrideSubject } from "@/types/features";

const clearFeatureOverride = async (
  name: string,
  subject: FeatureOverrideSubject,
  id: number,
): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<unknown>>(
    token,
    API_ROUTES.featureOverride(name, subject, id),
  );
  updateTag(CACHE_TAGS.features);
};

export default clearFeatureOverride;
