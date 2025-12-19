"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ConceptSet, ApiResponse } from "../types/api";
import { getTagConceptSets } from "@/config/tags";

const getConceptSets = async (): Promise<ApiResponse<ConceptSet[]>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();
  return await apiGet<ApiResponse<ConceptSet[]>>({
    url: API_ROUTES.conceptSets,
    tags: [getTagConceptSets(userId)],
  });
};

export default getConceptSets;
