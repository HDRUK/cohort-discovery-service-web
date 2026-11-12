import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  Concept,
  Paginated,
  SearchConceptsBody,
} from "@/types/api";

export const searchConcepts = async (
  body: SearchConceptsBody,
): Promise<ApiResponse<Paginated<Partial<Concept>>>> => {
  const { token } = await requireSession();
  return apiPost<ApiResponse<Paginated<Partial<Concept>>>, SearchConceptsBody>(
    token,
    API_ROUTES.searchConcepts,
    body,
    { errorMode: ErrorMode.RESULT },
  );
};
