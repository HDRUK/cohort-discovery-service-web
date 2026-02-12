"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Collection } from "../types/api";

const deleteCollection = async (
  id: number | string,
): Promise<ApiResponse<Collection>> => {
  return await apiDelete<ApiResponse<Collection>>(API_ROUTES.collection(id));
};

export default deleteCollection;
