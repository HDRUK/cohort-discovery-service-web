"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

interface Payload {
  query: string;
  ignore_synthetic?: boolean;
  prefer_non_synthetic?: boolean;
}

const parseQuery = async (
  query: string,
  options?: {
    ignoreSynthetic?: boolean;
    preferNonSynthetic?: boolean;
  },
): Promise<ApiResponse<string>> => {
  console.log({
    url: API_ROUTES.parseQuery,
    query,
    ignore_synthetic: options?.ignoreSynthetic,
    prefer_non_synthetic: options?.preferNonSynthetic,
  });
  return await apiPost<ApiResponse<string>, Payload>(API_ROUTES.parseQuery, {
    query,
    ignore_synthetic: options?.ignoreSynthetic,
    prefer_non_synthetic: options?.preferNonSynthetic,
  });
};

export default parseQuery;
