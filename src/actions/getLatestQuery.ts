"use server";

import { TAG_LATEST_QUERY } from "@/config/tags";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getLatestQuery = async (): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>({
    url: `${API_ROUTES.queries}/latest`,
    tags: [TAG_LATEST_QUERY],
  });
};

export default getLatestQuery;
