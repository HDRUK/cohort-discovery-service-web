"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, ApiResponse, ReadArgs } from "@/types/api";
import { TAG_COLLECTIONS } from "@/config/tags";

const getCollections = async (
  args?: ReadArgs,
): Promise<ApiResponse<Collection[]>> => {
  return await apiGet<ApiResponse<Collection[]>>({
    url: API_ROUTES.collections,
    tags: [TAG_COLLECTIONS],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getCollections;
