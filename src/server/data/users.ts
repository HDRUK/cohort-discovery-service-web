import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { LIST_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse, User } from "@/types/api";

export const getUsersList = async (): Promise<ApiResponse<User[]>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<User[]>>(token, API_ROUTES.users);
};
