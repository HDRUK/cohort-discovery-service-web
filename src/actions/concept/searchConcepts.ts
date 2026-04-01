"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Concept, ApiResponse, Paginated } from "@/types/api";

interface SearchConceptsBody {
  concept_name?: string[];
  concept_id?: string[];
  domain?: string;
  collections?: string[];
  page?: number;
  per_page?: number;
  include_ancestors?: boolean;
}

const searchConcepts = async (
  body: SearchConceptsBody,
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  const { data, message } = await apiPost<
    ApiResponse<Paginated<Partial<Concept>>>,
    SearchConceptsBody
  >(API_ROUTES.searchConcepts, body);

  return { data, message };
};

export default searchConcepts;
