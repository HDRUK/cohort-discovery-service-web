"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQueries = async (): Promise<ApiResponse<Query[]>> => {
  return apiGet<ApiResponse<Query[]>>(API_ROUTES.queries);
};

export default getQueries;
