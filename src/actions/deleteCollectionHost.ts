"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { CollectionHost, ApiResponse } from "../types/api";

const deleteCollectionHost = async (
  hostId: number,
): Promise<ApiResponse<CollectionHost>> => {
  return await apiDelete<ApiResponse<CollectionHost>>(
    API_ROUTES.collectionHost(hostId),
  );
};

export default deleteCollectionHost;
