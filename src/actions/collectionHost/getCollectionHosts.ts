"use server";

import { TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHostWithCredentials } from "@/types/api";

const getCollectionHosts = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<CollectionHostWithCredentials[]>> => {
  return await apiGet<ApiResponse<CollectionHostWithCredentials[]>>({
    url: API_ROUTES.collectionHosts,
    tags: [TAG_COLLECTION_HOSTS],
    ...args,
    cacheOptions: { useCache: false },
  });
};

export default getCollectionHosts;
