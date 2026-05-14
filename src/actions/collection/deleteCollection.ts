"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Collection } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const deleteCollection = async (
  id: number | string,
  custodianPid?: string,
): Promise<void> => {
  await apiDelete<ApiResponse<Collection>>(API_ROUTES.collection(id));
  await revalidateCollections(custodianPid);
};

export default deleteCollection;
