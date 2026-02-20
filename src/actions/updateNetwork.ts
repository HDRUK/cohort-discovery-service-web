"use server";

import { apiPut } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Network, ApiResponse, UpdateNetworkPost } from "../types/api";

const updateNetwork = async (
  id: number,
  payload: UpdateNetworkPost,
): Promise<ApiResponse<Network>> =>
  await apiPut<ApiResponse<Network>, UpdateNetworkPost>(
    API_ROUTES.network(id),
    payload,
  );

export default updateNetwork;
