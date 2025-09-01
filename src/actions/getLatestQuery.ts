"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getLatestQuery = async (): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>(`${API_ROUTES.queries}/latest`, {
    next: {
      tags: ["lastestQuery"],
    },
  });
};

export default getLatestQuery;
