"use server";

import { apiPut } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  CreateCollectionPost,
  ApiResponse,
  CollectionWithHosts,
} from "../types/api";

const updateCollection = async (
  id: number,
  payload: Partial<CreateCollectionPost>
): Promise<ApiResponse<CollectionWithHosts>> => {
  return await apiPut<
    ApiResponse<CollectionWithHosts>,
    Partial<CreateCollectionPost>
  >(API_ROUTES.collection(id), payload);
};

export default updateCollection;
