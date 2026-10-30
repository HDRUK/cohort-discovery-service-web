"use server";

import { apiPut, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Collection } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const restoreCollection = async (
  id: number | string,
  custodianPid?: string,
): Promise<ApiResponse<Collection>> => {
  const res = await apiPut<ApiResponse<Collection>, undefined>(
    API_ROUTES.restoreCollection(id),
    undefined,
    { errorMode: ErrorMode.RESULT },
  );
  await revalidateCollections(custodianPid);
  return res;
};

export default restoreCollection;
