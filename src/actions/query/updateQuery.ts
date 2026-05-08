"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Query, CreateQueryPost, ApiResponse } from "@/types/api";

const updateQuery = async (
  id: number,
  payload: Partial<CreateQueryPost>,
): Promise<ApiResponse<Query>> => {
  return await apiPut<ApiResponse<Query>, Partial<CreateQueryPost>>(
    `${API_ROUTES.query}/${id}`,
    payload,
  );
};

export default updateQuery;
