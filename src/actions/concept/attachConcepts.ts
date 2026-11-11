"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const attachConcepts = async (
  conceptSetId: number,
  conceptIds: number[],
): Promise<void> => {
  const { token } = await requireSession();
  await Promise.all(
    conceptIds.map((conceptId) =>
      apiPost<ApiResponse<Concept>, Record<string, never>>(
        token,
        API_ROUTES.attachConcept(conceptSetId, conceptId),
        {},
      ),
    ),
  );
  refresh();
};

export default attachConcepts;
