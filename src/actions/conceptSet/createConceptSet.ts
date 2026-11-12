"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, CreateConceptSetPost, ApiResponse } from "@/types/api";

const createConceptSet = async (
  payload: CreateConceptSetPost,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPost<ApiResponse<Collection>, CreateConceptSetPost>(
    token,
    API_ROUTES.conceptSets,
    payload,
  );
  updateTag(CACHE_TAGS.conceptSets);
};

export default createConceptSet;
