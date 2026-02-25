"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_CODES_PER_PAGE } from "@/config/defaults";
import { getTagConcepts } from "@/config/tags";

const getConcepts = async (
  searchTerm: string,
  domain?: string,
  page = 1,
  per_page = DEFAULT_CODES_PER_PAGE,
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
    "description[]": searchTerm,
    "concept_id[]": searchTerm,
    ...(domain ? { domain } : {}),
  });

  const { data, message } = await apiGet<
    ApiResponse<Paginated<Partial<Concept>>>
  >({
    url: API_ROUTES.searchConcepts,
    params,
    tags: getTagConcepts(domain),
  });

  return {
    data,
    message,
  };
};

export default getConcepts;
