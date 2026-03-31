"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "@/types/api";
import { getTagConcepts } from "@/config/tags";

const getConcepts = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  const { data, message } = await apiGet<
    ApiResponse<Paginated<Partial<Concept>>>
  >({
    url: API_ROUTES.searchConcepts,
    tags: getTagConcepts(args?.params?.toString()),
    cacheOptions: { useCache: false },
    ...args,
  });

  return {
    data,
    message,
  };
};

export default getConcepts;
