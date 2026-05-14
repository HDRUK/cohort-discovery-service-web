"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, CreateNetworkPost } from "@/types/api";
import { revalidateNetworks } from "@/actions/revalidate";

const createNetwork = async (payload: CreateNetworkPost): Promise<Network> => {
  const { data } = await apiPost<ApiResponse<Network>, CreateNetworkPost>(
    API_ROUTES.networks,
    payload,
  );
  await revalidateNetworks();
  return data;
};

export default createNetwork;
