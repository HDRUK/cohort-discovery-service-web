import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { AccessPolicy } from "@/types/accessPolicy";
import { ApiResponse } from "@/types/api";

const fetchCachedAccessPolicy = async (): Promise<AccessPolicy> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);
  cacheTag(CACHE_TAGS.accessPolicy);

  const { token } = await requireSession();
  const response = await apiGet<ApiResponse<AccessPolicy>>(
    token,
    API_ROUTES.accessPolicy,
    { errorMode: ErrorMode.RESULT },
  );
  if (response.error) throw new Error(response.error.text);

  return response.data;
};

export const getAccessPolicy = async (): Promise<AccessPolicy | null> => {
  try {
    return await fetchCachedAccessPolicy();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
};
