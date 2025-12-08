"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "../types/api";
import { DEFAULT_CODES_PER_PAGE, DEFAULT_REVALIDATE } from "../config/defaults";
import { getTokenKey } from "@/utils/string";

const getConcepts = async (
  searchTerm: string,
  domain?: string,
  page = 1,
  per_page = DEFAULT_CODES_PER_PAGE
): Promise<ApiResponse<Paginated<Partial<Concept>[]>>> => {
  const baseUrl = API_ROUTES.searchConcepts;

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
    "description[]": searchTerm,
    "concept_id[]": searchTerm,
    ...(domain ? { domain } : {}),
  });

  const url = `${baseUrl}?${params.toString()}`;
  const key = getTokenKey(url);

  const { data, message } = await apiGet<
    ApiResponse<Paginated<Partial<Concept>[]>>
  >(url, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: [
        "all",
        "concepts",
        `concepts-${domain}`,
        `concepts-${domain}-${key}`,
      ],
    },
    cache: "force-cache",
  });

  return {
    data,
    message,
  };
};

export default getConcepts;
