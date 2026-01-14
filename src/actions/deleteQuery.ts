"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Query } from "../types/api";

const deleteQuery = async (pid: string): Promise<ApiResponse<Query>> => {
  return await apiDelete<ApiResponse<Query>>(API_ROUTES.getQuery(pid));
};

export default deleteQuery;
