"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, CreateNetworkPost } from "@/types/api";

const createNetwork = async (payload: CreateNetworkPost): Promise<Network> => {
  const { token } = await requireSession();
  const { data } = await apiPost<ApiResponse<Network>, CreateNetworkPost>(
    token,
    API_ROUTES.networks,
    payload,
  );
  refresh();
  return data;
};

export default createNetwork;
