"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Network } from "@/types/api";
import { revalidateNetworks } from "@/actions/revalidate";

const deleteNetwork = async (id: number): Promise<void> => {
  await apiDelete<ApiResponse<Network>>(API_ROUTES.network(id));
  await revalidateNetworks();
};

export default deleteNetwork;
