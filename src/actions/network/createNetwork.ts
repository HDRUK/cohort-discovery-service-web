"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, CreateNetworkPost } from "@/types/api";

const createNetwork = async (
  payload: CreateNetworkPost,
): Promise<ApiResponse<Network>> => {
  return await apiPost<ApiResponse<Network>, CreateNetworkPost>(
    API_ROUTES.networks,
    payload,
  );
};

export default createNetwork;
