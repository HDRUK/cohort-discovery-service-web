"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { CodeStat, ApiResponse, Paginated } from "../../types/api";
import { DEFAULT_CODES_PER_PAGE } from "../../config/defaults";
import { getTagCodeStats } from "@/config/tags";

const getCodeStats = async (
  page = 1,
  per_page = DEFAULT_CODES_PER_PAGE,
): Promise<ApiResponse<Paginated<CodeStat>>> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  return await apiGet<ApiResponse<Paginated<CodeStat>>>({
    url: API_ROUTES.getCodes("stats"),
    params,
    tags: getTagCodeStats(),
  });
};

export default getCodeStats;
