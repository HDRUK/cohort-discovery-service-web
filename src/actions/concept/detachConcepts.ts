"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_CONCEPT_SETS } from "@/config/tags";

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
  await revalidateUserAction(TAG_CONCEPT_SETS);
};

export default detachConcepts;
