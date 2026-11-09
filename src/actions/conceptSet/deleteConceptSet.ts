"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Concept } from "@/types/api";

const deleteConceptSet = async (conceptSetId: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<Concept>>(
    token,
    API_ROUTES.getConceptSet(conceptSetId),
  );
  refresh();
};

export default deleteConceptSet;
