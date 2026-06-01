"use server";

import { getCollectionHostTag, TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHost } from "@/types/api";

const getCustodianCollectionHosts = async (
  custodianPid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<CollectionHost[]>> => {
  return await apiGet<ApiResponse<CollectionHost[]>>({
    url: API_ROUTES.custodianCollectionHosts(custodianPid),
    tags: [TAG_COLLECTION_HOSTS, getCollectionHostTag(custodianPid)],
    ...args,
  });
};

export default getCustodianCollectionHosts;
