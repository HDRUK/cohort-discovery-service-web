"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  Collection,
  ApiResponse,
  CreateCollectionConfigPost,
} from "../types/api";

const createCollectionConfig = async (
  payload: CreateCollectionConfigPost,
): Promise<ApiResponse<Collection>> => {
  return await apiPost<ApiResponse<Collection>, CreateCollectionConfigPost>(
    API_ROUTES.collectionConfig,
    payload,
  );
};

export default createCollectionConfig;
