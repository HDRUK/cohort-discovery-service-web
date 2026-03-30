"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_CODES_PER_PAGE } from "@/config/defaults";
import { getTagConcepts } from "@/config/tags";

const getConcepts = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  /*const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
    "concept_name[]": searchTerm,
    "concept_id[]": searchTerm,
    ...(domain ? { domain } : {}),
  });*/

  const { data, message } = await apiGet<
    ApiResponse<Paginated<Partial<Concept>>>
  >({
    url: API_ROUTES.searchConcepts,
    //tags: getTagConcepts(domain),
    ...args,
  });

  return {
    data,
    message,
  };
};

export default getConcepts;
