"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  Collection,
  ApiResponse,
  CreateCollectionConfigPost,
} from "@/types/api";

const updateCollectionConfig = async (
  id: number,
  payload: Partial<CreateCollectionConfigPost>,
): Promise<ApiResponse<Collection>> => {
  return await apiPut<
    ApiResponse<Collection>,
    Partial<CreateCollectionConfigPost>
  >(`${API_ROUTES.collectionConfig}/${id}`, payload);
};

export default updateCollectionConfig;
