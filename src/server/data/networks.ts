import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { LIST_CACHE_LIFE } from "@/server/cacheProfiles";
import { isSearchQuery, toListQuery } from "@/server/listQuery";
import { requireSession } from "@/server/session";
import { ApiResponse, Network } from "@/types/api";

const fetchNetworks = async (
  queryString: string,
): Promise<ApiResponse<Network[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Network[]>>(token, API_ROUTES.networks, {
    params: queryString,
  });
};

const fetchCachedNetworks = async (
  queryString: string,
): Promise<ApiResponse<Network[]>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);

  return fetchNetworks(queryString);
};

export const getNetworks = (
  params?: URLSearchParams | string,
): Promise<ApiResponse<Network[]>> => {
  const queryString = toListQuery(params);
  return isSearchQuery(queryString)
    ? fetchNetworks(queryString)
    : fetchCachedNetworks(queryString);
};
