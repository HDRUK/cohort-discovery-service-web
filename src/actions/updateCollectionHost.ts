"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CollectionHost,
  UpdateCollectionHostPayload,
  ApiResponse,
} from "@/types/api";

const updateCollectionHost = async (
  hostId: number,
  payload: UpdateCollectionHostPayload,
): Promise<ApiResponse<CollectionHost>> => {
  return await apiPut<ApiResponse<CollectionHost>, UpdateCollectionHostPayload>(
    API_ROUTES.collectionHost(hostId),
    payload,
  );
};

export default updateCollectionHost;
