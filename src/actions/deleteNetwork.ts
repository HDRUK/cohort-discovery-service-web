"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Network } from "../types/api";

const deleteNetwork = async (id: number): Promise<ApiResponse<Network>> => {
  return await apiDelete<ApiResponse<Network>>(API_ROUTES.network(id));
};

export default deleteNetwork;
