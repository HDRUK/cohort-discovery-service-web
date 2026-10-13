"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { TermDirectoryEntry, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { DomainTab } from "@/config/domainFilters";
import { getTagTermDirectory } from "@/config/tags";
import { buildTermDirectoryParams } from "@/utils/buildTermDirectoryParams";

const getTermDirectory = async (
  page = 1,
  per_page = DEFAULT_PER_PAGE,
  search?: string,
  domain?: DomainTab,
  collections?: string[],
  sort?: string,
): Promise<ApiResponse<Paginated<TermDirectoryEntry>>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();

  const params = buildTermDirectoryParams(
    page,
    per_page,
    search,
    domain,
    collections,
    sort,
  );

  const result = await apiGet<ApiResponse<Paginated<TermDirectoryEntry>>>({
    url: API_ROUTES.termDirectory,
    params,
    tags: [getTagTermDirectory(userId)],
  });

  return result;
};

export default getTermDirectory;
