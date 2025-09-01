"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { CodeStat, ApiResponse, Paginated } from "../../types/api";
import { DEFAULT_CODES_PER_PAGE } from "../../config/defaults";

const getCodeStats = async (
  page = 1,
  per_page = DEFAULT_CODES_PER_PAGE
): Promise<ApiResponse<Paginated<CodeStat[]>>> => {
  return await apiGet<ApiResponse<Paginated<CodeStat[]>>>(
    `${API_ROUTES.getCodes("stats")}?page=${page}&per_page=${per_page}`,
    {
      next: { revalidate: 60, tags: ["omop", "stats"] },
      cache: "force-cache",
    }
  );
};

export default getCodeStats;
