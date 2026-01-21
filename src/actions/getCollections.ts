"use server";

import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";
import { TAG_COLLECTIONS } from "@/config/tags";

const getCollections = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Collection[]>> => {
  return await apiGet<ApiResponse<Collection[]>>({
    url: API_ROUTES.collections,
    tags: [TAG_COLLECTIONS],
    ...args,
  });
};

export default getCollections;
