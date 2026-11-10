"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, CreateConceptSetPost, ApiResponse } from "@/types/api";
import { pick } from "@/utils/pick";

const CONCEPT_SET_FIELDS = ["name", "description", "domain"] as const;

const createConceptSet = async (
  payload: CreateConceptSetPost,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPost<ApiResponse<Collection>, CreateConceptSetPost>(
    token,
    API_ROUTES.conceptSets,
    pick(payload, CONCEPT_SET_FIELDS),
  );
  refresh();
};

export default createConceptSet;
