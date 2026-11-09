import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  CollectionHost,
  CollectionHostWithCredentials,
  ReadArgs,
} from "@/types/api";

export const getCollectionHosts = async (): Promise<
  ApiResponse<CollectionHost[]>
> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<CollectionHost[]>>(
    token,
    API_ROUTES.collectionHosts,
  );
};

export const getCustodianCollectionHosts = async (
  custodianPid: string,
  args?: ReadArgs,
): Promise<ApiResponse<CollectionHost[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<CollectionHost[]>>(
    token,
    API_ROUTES.custodianCollectionHosts(custodianPid),
    { params: args?.params },
  );
};

export const getCollectionHostWithCredentials = (
  token: string,
  hostId: number,
): Promise<ApiResponse<CollectionHostWithCredentials | null>> =>
  apiGet<ApiResponse<CollectionHostWithCredentials | null>>(
    token,
    API_ROUTES.collectionHost(hostId),
    { errorMode: ErrorMode.RESULT },
  );
