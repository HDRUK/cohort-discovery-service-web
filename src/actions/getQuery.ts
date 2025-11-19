"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (
  pid: string,
  searchTerm?: string
): Promise<ApiResponse<Query>> => {
  const baseUrl = API_ROUTES.getQuery(pid);
  const url = searchTerm ? `${baseUrl}?name[]=${searchTerm}` : baseUrl;

  return await apiGet<ApiResponse<Query>>(url, {
    next: {
      tags: ["query", pid],
    },
  });
};

export default getQuery;
