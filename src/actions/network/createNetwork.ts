"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, CreateNetworkPost } from "@/types/api";
import { pick } from "@/utils/pick";

const NETWORK_FIELDS = ["name", "url"] as const;

const createNetwork = async (payload: CreateNetworkPost): Promise<Network> => {
  const { token } = await requireSession();
  const { data } = await apiPost<ApiResponse<Network>, CreateNetworkPost>(
    token,
    API_ROUTES.networks,
    pick(payload, NETWORK_FIELDS),
  );
  refresh();
  return data;
};

export default createNetwork;
