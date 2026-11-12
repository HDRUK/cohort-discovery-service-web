"use server";

import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const clearConcepts = async (conceptSetId: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<Concept>>(
    token,
    API_ROUTES.clearConceptSet(conceptSetId),
  );
};

export default clearConcepts;
