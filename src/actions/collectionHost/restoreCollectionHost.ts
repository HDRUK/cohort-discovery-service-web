"use server";

import { apiPut, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const restoreCollectionHost = async (
  hostId: number,
  custodianPid?: string,
): Promise<ApiResponse<CollectionHost>> => {
  const res = await apiPut<ApiResponse<CollectionHost>, undefined>(
    API_ROUTES.restoreCollectionHost(hostId),
    undefined,
    { errorMode: ErrorMode.RESULT },
  );
  await revalidateCollections(custodianPid);
  return res;
};

export default restoreCollectionHost;
