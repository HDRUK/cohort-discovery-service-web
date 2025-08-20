"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  return await apiGet<ApiResponse<Collection[]>>(API_ROUTES.collections, {
    next: { revalidate: 3600, tags: ["collections"] },
    cache: "force-cache",
  });
};

export default getCollections;
