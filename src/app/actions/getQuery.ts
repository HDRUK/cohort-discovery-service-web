"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (pid: string): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>(API_ROUTES.getQuery(pid), {
    next: {
      tags: ["query", pid],
    },
  });
};

export default getQuery;
