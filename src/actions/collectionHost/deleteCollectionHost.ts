"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const deleteCollectionHost = async (
  hostId: number,
  custodianPid?: string,
): Promise<void> => {
  await apiDelete<ApiResponse<CollectionHost>>(API_ROUTES.collectionHost(hostId));
  await revalidateCollections(custodianPid);
};

export default deleteCollectionHost;
