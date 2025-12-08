"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ConceptSet, ApiResponse } from "../types/api";
import { getTokenKey } from "@/utils/string";
import { cookies } from "next/headers";

const getConceptSets = async (): Promise<ApiResponse<ConceptSet[]>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);
  return await apiGet<ApiResponse<ConceptSet[]>>(API_ROUTES.conceptSets, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: ["all", "concept-sets", `concept-sets-${key}}`],
    },
    cache: "force-cache",
  });
};

export default getConceptSets;
