"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Network, ReadArgs } from "@/types/api";
import { TAG_NETWORKS } from "@/config/tags";

const getNetworks = async (
  args?: ReadArgs,
): Promise<ApiResponse<Network[]>> => {
  return await apiGet<ApiResponse<Network[]>>({
    url: API_ROUTES.networks,
    tags: [TAG_NETWORKS],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getNetworks;
