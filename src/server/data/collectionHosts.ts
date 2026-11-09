import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { LIST_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  CollectionHost,
  CollectionHostWithCredentials,
  ReadArgs,
} from "@/types/api";
import { canonicaliseQueryString } from "@/utils/string";

export const getCollectionHosts = async (): Promise<
  ApiResponse<CollectionHost[]>
> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<CollectionHost[]>>(
    token,
    API_ROUTES.collectionHosts,
  );
};

const fetchCustodianCollectionHosts = async (
  custodianPid: string,
  queryString: string,
): Promise<ApiResponse<CollectionHost[]>> => {
  "use cache: private";
  cacheLife(LIST_CACHE_LIFE);

  const { token } = await requireSession();
  return apiGet<ApiResponse<CollectionHost[]>>(
    token,
    API_ROUTES.custodianCollectionHosts(custodianPid),
    { params: queryString },
  );
};

export const getCustodianCollectionHosts = (
  custodianPid: string,
  args?: ReadArgs,
): Promise<ApiResponse<CollectionHost[]>> =>
  fetchCustodianCollectionHosts(
    custodianPid,
    canonicaliseQueryString(args?.params),
  );

export const getCollectionHostWithCredentials = (
  token: string,
  hostId: number,
): Promise<ApiResponse<CollectionHostWithCredentials | null>> =>
  apiGet<ApiResponse<CollectionHostWithCredentials | null>>(
    token,
    API_ROUTES.collectionHost(hostId),
    { errorMode: ErrorMode.RESULT },
  );
