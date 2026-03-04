"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const detachConcepts = async (
  conceptSetId: number,
  conceptIds: number[],
): Promise<void> => {
  await Promise.all(
    conceptIds.map((conceptId) =>
      apiDelete<ApiResponse<Concept>>(
        API_ROUTES.detachConcept(conceptSetId, conceptId),
        { cache: "no-store" },
      ),
    ),
  );
};

export default detachConcepts;
