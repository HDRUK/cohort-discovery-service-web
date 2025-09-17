"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";

const getCustodianCollections = async (
  custodianPid: string
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(
    API_ROUTES.custodianCollections(custodianPid),
    {
      next: { revalidate: 3600, tags: [`collections-${custodianPid}`] },
      cache: "force-cache",
    }
  );
};

export default getCustodianCollections;
