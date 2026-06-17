"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "@/types/api";

const getDistributionConcepts = async (
  domain: string,
): Promise<ApiResponse<Paginated<Concept>>> => {
  return await apiGet<ApiResponse<Paginated<Concept>>>({
    url: API_ROUTES.distributionConcepts(domain),
    tags: [`distributionConcepts-${domain}`],
  });
};

export default getDistributionConcepts;
