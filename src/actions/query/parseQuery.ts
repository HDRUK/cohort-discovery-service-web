"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

interface Payload {
  query: string;
}

const parseQuery = async (query: string): Promise<ApiResponse<string>> => {
  return await apiPost<ApiResponse<string>, Payload>(API_ROUTES.parseQuery, {
    query,
  });
};

export default parseQuery;
