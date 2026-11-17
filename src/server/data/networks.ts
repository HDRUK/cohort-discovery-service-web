import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { LIST_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse, Network } from "@/types/api";

export const getNetworks = async (): Promise<ApiResponse<Network[]>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);
  cacheTag(CACHE_TAGS.networks);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Network[]>>(token, API_ROUTES.networks);
};
