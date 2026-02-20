"use server";

import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Network } from "../types/api";
import { TAG_NETWORKS } from "@/config/tags";

const getNetworks = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Network[]>> => {
  return await apiGet<ApiResponse<Network[]>>({
    url: API_ROUTES.networks,
    tags: [TAG_NETWORKS],
    ...args,
  });
};

export default getNetworks;
