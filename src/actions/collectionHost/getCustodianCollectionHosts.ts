"use server";

import { getCollectionHostTag, TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHostWithCredentials } from "@/types/api";

const getCustodianCollectionHosts = async (
  custodianPid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<CollectionHostWithCredentials[]>> => {
  return await apiGet<ApiResponse<CollectionHostWithCredentials[]>>({
    url: API_ROUTES.custodianCollectionHosts(custodianPid),
    tags: [TAG_COLLECTION_HOSTS, getCollectionHostTag(custodianPid)],
    ...args,
    cacheOptions: { useCache: false },
  });
};

export default getCustodianCollectionHosts;
