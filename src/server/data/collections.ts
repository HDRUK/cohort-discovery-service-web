import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse, Collection } from "@/types/api";

export const getUserCollections = async (): Promise<
  ApiResponse<Collection[]>
> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Collection[]>>(token, API_ROUTES.userCollections);
};
