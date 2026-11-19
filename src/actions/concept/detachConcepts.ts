"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const detachConcepts = async (
  conceptSetId: number,
  conceptIds: number[],
): Promise<void> => {
  const { token } = await requireSession();
  await Promise.all(
    conceptIds.map((conceptId) =>
      apiDelete<ApiResponse<Concept>>(
        token,
        API_ROUTES.detachConcept(conceptSetId, conceptId),
      ),
    ),
  );
  updateTag(CACHE_TAGS.conceptSets);
};

export default detachConcepts;
