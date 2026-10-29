"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Collection } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const restoreCollection = async (
  id: number | string,
  custodianPid?: string,
): Promise<void> => {
  await apiPut<ApiResponse<Collection>, undefined>(
    API_ROUTES.restoreCollection(id),
    undefined,
  );
  await revalidateCollections(custodianPid);
};

export default restoreCollection;
