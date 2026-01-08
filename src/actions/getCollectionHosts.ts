"use server";

import { TAG_COLLECTION_HOSTS } from "@/config/tags";
import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, CollectionHost } from "../types/api";

const getCollectionHosts = async (
  args?: Omit<CachedGetArgs, "url">
): Promise<ApiResponse<CollectionHost[]>> => {
  return await apiGet<ApiResponse<CollectionHost[]>>({
    url: API_ROUTES.collectionHosts,
    tags: [TAG_COLLECTION_HOSTS],
    ...args,
  });
};

export default getCollectionHosts;
