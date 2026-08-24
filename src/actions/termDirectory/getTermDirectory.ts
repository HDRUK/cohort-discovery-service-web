"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { TermDirectoryEntry, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { DOMAIN_TAB_FILTERS, DomainTab } from "@/config/domainFilters";
import { getTagTermDirectory } from "@/config/tags";

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

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  if (search) {
    params.set("concept_name", search);
    params.set("concept_id", search);
  }

  if (domain) {
    const domainIds = DOMAIN_TAB_FILTERS[domain] ?? [];

    if (domainIds.length > 1) {
      params.set("domain_id__in", domainIds.join(","));
    } else if (domainIds.length === 1) {
      params.set("domain_id", domainIds[0]);
    }
  }

  collections?.forEach((pid) => params.append("collection_pid[]", pid));

  if (sort) {
    params.set("sort", sort);
  }

  console.log("getTermDirectory params:", params.toString());

  const result = await apiGet<ApiResponse<Paginated<TermDirectoryEntry>>>({
    url: API_ROUTES.termDirectory,
    params,
    tags: [getTagTermDirectory(userId)],
  });

  return result;
};

export default getTermDirectory;
