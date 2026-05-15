"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CollectionHost,
  UpdateCollectionHostPayload,
  ApiResponse,
} from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const updateCollectionHost = async (
  hostId: number,
  payload: UpdateCollectionHostPayload,
  custodianPid?: string,
): Promise<void> => {
  await apiPut<ApiResponse<CollectionHost>, UpdateCollectionHostPayload>(
    API_ROUTES.collectionHost(hostId),
    payload,
  );
  await revalidateCollections(custodianPid);
};

export default updateCollectionHost;
