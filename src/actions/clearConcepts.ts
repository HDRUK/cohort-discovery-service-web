"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Concept } from "../types/api";

const clearConcepts = async (conceptSetId: number): Promise<void> => {
  await apiDelete<ApiResponse<Concept>>(
    API_ROUTES.clearConceptSet(conceptSetId),
    { cache: "no-store" }
  );
};

export default clearConcepts;
