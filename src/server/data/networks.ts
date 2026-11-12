import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, Network } from "@/types/api";

export const getNetworks = async (
  queryString?: string,
): Promise<ApiResponse<Network[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Network[]>>(token, API_ROUTES.networks, {
    params: queryString,
  });
};
