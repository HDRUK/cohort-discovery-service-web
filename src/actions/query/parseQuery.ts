"use server";

import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

interface Payload {
  query: string;
  ignore_synthetic?: boolean;
  prefer_non_synthetic?: boolean;
  collections?: string[];
}

const parseQuery = async (
  query: string,
  options?: {
    ignoreSynthetic?: boolean;
    preferNonSynthetic?: boolean;
    collections?: string[];
  },
): Promise<ApiResponse<string>> => {
  const { token } = await requireSession();
  return await apiPost<ApiResponse<string>, Payload>(
    token,
    API_ROUTES.parseQuery,
    {
      query,
      ignore_synthetic: options?.ignoreSynthetic,
      prefer_non_synthetic: options?.preferNonSynthetic,
      collections: options?.collections,
    },
  );
};

export default parseQuery;
