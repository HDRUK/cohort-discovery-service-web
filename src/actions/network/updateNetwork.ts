"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, UpdateNetworkPost } from "@/types/api";
import { revalidateNetworks } from "@/actions/revalidate";

const updateNetwork = async (
  id: number,
  payload: UpdateNetworkPost,
): Promise<void> => {
  await apiPut<ApiResponse<Network>, UpdateNetworkPost>(
    API_ROUTES.network(id),
    payload,
  );
  await revalidateNetworks();
};

export default updateNetwork;
