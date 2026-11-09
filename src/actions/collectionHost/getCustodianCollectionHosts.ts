"use server";

import { getCollectionHostTag, TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHost, ReadArgs } from "@/types/api";

const getCustodianCollectionHosts = async (
  custodianPid: string,
  args?: Pick<ReadArgs, "params">,
): Promise<ApiResponse<CollectionHost[]>> => {
  return await apiGet<ApiResponse<CollectionHost[]>>({
    url: API_ROUTES.custodianCollectionHosts(custodianPid),
    tags: [TAG_COLLECTION_HOSTS, getCollectionHostTag(custodianPid)],
    params: args?.params,
    cacheOptions: { useCache: false },
  });
};

export default getCustodianCollectionHosts;
