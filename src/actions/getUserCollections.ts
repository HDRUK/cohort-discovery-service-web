"use server";

import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";
import { TAG_COLLECTIONS, TAG_COLLECTIONS_USER } from "@/config/tags";

const getUserCollections = async (
  args?: Omit<CachedGetArgs, "url">
): Promise<ApiResponse<Collection[]>> => {
  return await apiGet<ApiResponse<Collection[]>>({
    url: API_ROUTES.userCollections,
    tags: [TAG_COLLECTIONS_USER, TAG_COLLECTIONS],
    ...args,
  });
};

export default getUserCollections;
