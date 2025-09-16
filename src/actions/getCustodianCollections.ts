"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, CollectionWithHosts } from "../types/api";

const getCustodianCollections = async (
  custodianPid: string
): Promise<ApiResponse<CollectionWithHosts[]>> => {
  return await apiGet<ApiResponse<CollectionWithHosts[]>>(
    API_ROUTES.custodianCollections(custodianPid),
    {
      next: { revalidate: 3600, tags: [`collections-${custodianPid}`] },
      cache: "force-cache",
    }
  );
};

export default getCustodianCollections;
