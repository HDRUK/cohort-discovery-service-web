"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Paginated,
  CollectionWithHosts,
  ReadArgs,
} from "@/types/api";
import { TAG_COLLECTIONS_ADMIN } from "@/config/tags";

const getAdminCollections = async (
  args?: ReadArgs,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  return await apiGet<ApiResponse<Paginated<CollectionWithHosts>>>({
    url: API_ROUTES.adminCollections,
    tags: [TAG_COLLECTIONS_ADMIN],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getAdminCollections;
