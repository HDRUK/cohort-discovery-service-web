"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  return await apiGet<ApiResponse<Collection[]>>(API_ROUTES.collections, {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["collections"] },
    cache: "force-cache",
  });
};

export default getCollections;
