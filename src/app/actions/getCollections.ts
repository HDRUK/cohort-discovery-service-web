"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, ApiResponse } from "../types/api";

const getCollections = async (): Promise<ApiResponse<Collection[]>> => {
  const response = await apiGet<ApiResponse<Collection[]>>(
    API_ROUTES.collections,
    {
      next: { revalidate: 3600, tags: ["collections"] },
      cache: "force-cache",
    }
  );
  return response;
};

export default getCollections;
