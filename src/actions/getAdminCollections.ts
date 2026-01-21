"use server";

import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";
import { TAG_COLLECTION_ADMIN } from "@/config/tags";

const getAdminCollections = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>({
    url: API_ROUTES.adminCollections,
    tags: [TAG_COLLECTION_ADMIN],
    ...args,
  });
};

export default getAdminCollections;
