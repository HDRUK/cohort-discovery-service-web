"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_CONCEPT_SETS } from "@/config/tags";

const deleteConceptSet = async (conceptSetId: number): Promise<void> => {
  await apiDelete<ApiResponse<Concept>>(API_ROUTES.getConceptSet(conceptSetId), {
    cache: "no-store",
  });
  await revalidateUserAction(TAG_CONCEPT_SETS);
};

export default deleteConceptSet;
