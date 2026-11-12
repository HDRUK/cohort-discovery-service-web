"use server";

import { TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHost, ReadArgs } from "@/types/api";

const getCollectionHosts = async (
  args?: Pick<ReadArgs, "params">,
): Promise<ApiResponse<CollectionHost[]>> => {
  return await apiGet<ApiResponse<CollectionHost[]>>({
    url: API_ROUTES.collectionHosts,
    tags: [TAG_COLLECTION_HOSTS],
    params: args?.params,
    cacheOptions: { useCache: false },
  });
};

export default getCollectionHosts;
