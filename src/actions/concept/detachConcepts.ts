"use server";

import { refresh } from "next/cache";
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
  refresh();
};

export default detachConcepts;
