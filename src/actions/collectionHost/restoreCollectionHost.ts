"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const restoreCollectionHost = async (
  hostId: number,
  custodianPid?: string,
): Promise<void> => {
  await apiPut<ApiResponse<CollectionHost>, undefined>(
    API_ROUTES.restoreCollectionHost(hostId),
    undefined,
  );
  await revalidateCollections(custodianPid);
};

export default restoreCollectionHost;
