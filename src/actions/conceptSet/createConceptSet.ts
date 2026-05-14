"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, CreateConceptSetPost, ApiResponse } from "@/types/api";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_CONCEPT_SETS } from "@/config/tags";

const createConceptSet = async (payload: CreateConceptSetPost): Promise<void> => {
  await apiPost<ApiResponse<Collection>, CreateConceptSetPost>(
    API_ROUTES.conceptSets,
    payload,
  );
  await revalidateUserAction(TAG_CONCEPT_SETS);
};

export default createConceptSet;
