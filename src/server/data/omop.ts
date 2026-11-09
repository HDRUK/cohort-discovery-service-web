import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { CodeStat, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_CODES_PER_PAGE } from "@/config/defaults";

export const getCodeStats = async (
  page = 1,
  per_page = DEFAULT_CODES_PER_PAGE,
): Promise<ApiResponse<Paginated<CodeStat>>> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Paginated<CodeStat>>>(
    token,
    API_ROUTES.getCodes("stats"),
    {
      params: new URLSearchParams({
        page: String(page),
        per_page: String(per_page),
      }),
    },
  );
};
