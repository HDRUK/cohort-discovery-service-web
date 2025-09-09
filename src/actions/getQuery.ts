"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (queryId: string): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>(API_ROUTES.getQuery(queryId), {
    next: { tags: ["query", queryId] },
  });
};

export default getQuery;
