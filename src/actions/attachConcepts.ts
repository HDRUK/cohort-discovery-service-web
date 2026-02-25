"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const attachConcepts = async (
  conceptSetId: number,
  conceptIds: number[],
): Promise<void> => {
  await Promise.all(
    conceptIds.map((conceptId) =>
      apiPost<ApiResponse<Concept>, Record<string, never>>(
        API_ROUTES.attachConcept(conceptSetId, conceptId),
        {},
        { cache: "no-store" },
      ),
    ),
  );
};

export default attachConcepts;
