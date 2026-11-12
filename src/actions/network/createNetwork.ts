"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
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
  updateTag(CACHE_TAGS.custodians);
  updateTag(CACHE_TAGS.collections);
  return data;
};

export default createNetwork;
