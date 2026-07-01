"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { TermDirectoryEntry, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { getTagTermDirectory } from "@/config/tags";

const getTermDirectory = async (
  page = 1,
  per_page = DEFAULT_PER_PAGE,
): Promise<ApiResponse<Paginated<TermDirectoryEntry>>> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  const result = await apiGet<ApiResponse<Paginated<TermDirectoryEntry>>>({
    url: API_ROUTES.termDirectory,
    params,
    tags: getTagTermDirectory(),
  });

  const rows = result.data.data.map((entry) => ({
    ...entry,
    id: entry.concept_id,
  }));

  return {
    ...result,
    data: {
      ...result.data,
      data: rows,
    },
  };
};

export default getTermDirectory;
