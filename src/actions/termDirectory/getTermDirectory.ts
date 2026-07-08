"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { TermDirectoryEntry, ApiResponse, Paginated } from "@/types/api";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import { getTagTermDirectory } from "@/config/tags";

const getTermDirectory = async (
  page = 1,
  per_page = DEFAULT_PER_PAGE,
  search?: string,
  domain?: string,
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

  if (domain === "Person") {
    params.set("domain_id__in", "Gender,Race,Ethnicity");
  } else if (domain === "Medication") {
    params.set("domain_id", "Drug");
  } else if (domain) {
    params.set("domain_id", domain);
  }

  const result = await apiGet<ApiResponse<Paginated<TermDirectoryEntry>>>({
    url: API_ROUTES.termDirectory,
    params,
    tags: [getTagTermDirectory(userId)],
  });

  return result;
};

export default getTermDirectory;
