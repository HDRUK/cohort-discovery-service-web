"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, CreateConceptSetPost, ApiResponse } from "@/types/api";

const createConceptSet = async (
  payload: CreateConceptSetPost,
): Promise<ApiResponse<Collection>> => {
  return await apiPost<ApiResponse<Collection>, CreateConceptSetPost>(
    API_ROUTES.conceptSets,
    payload,
  );
};

export default createConceptSet;
