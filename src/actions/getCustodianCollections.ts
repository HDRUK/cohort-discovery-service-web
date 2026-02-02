"use server";

import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";

import { getTagCustodianCollection } from "@/config/tags";

const getCustodianCollections = async (
  custodianPid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  const tag = getTagCustodianCollection(custodianPid);
  const url = API_ROUTES.custodianCollections(custodianPid);

  return await apiGet<ApiResponse<Paginated<CollectionWithHosts>>>({
    url,
    tags: [tag],
    ...args,
  });
};

export default getCustodianCollections;
