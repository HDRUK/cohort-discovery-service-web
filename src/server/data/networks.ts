import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { LIST_CACHE_LIFE } from "@/server/cacheProfiles";
import { toListQuery } from "@/server/listQuery";
import { requireSession } from "@/server/session";
import { ApiResponse, Custodian, Network, Paginated } from "@/types/api";

export const getNetworks = async (): Promise<ApiResponse<Network[]>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);
  cacheTag(CACHE_TAGS.networks);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Network[]>>(token, API_ROUTES.networks);
};

const fetchNetworkCustodians = async (
  networkId: number,
  queryString: string,
): Promise<ApiResponse<Paginated<Custodian>>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);
  cacheTag(CACHE_TAGS.networks, CACHE_TAGS.custodians);

  const { token } = await requireSession();
  return apiGet<ApiResponse<Paginated<Custodian>>>(
    token,
    API_ROUTES.networkCustodians(networkId),
    { params: queryString },
  );
};

export const getNetworkCustodians = (
  networkId: number,
  params?: URLSearchParams | string,
): Promise<ApiResponse<Paginated<Custodian>>> =>
  fetchNetworkCustodians(networkId, toListQuery(params));
