"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Paginated,
  CollectionWithHosts,
  ReadArgs,
} from "@/types/api";
import { getTagCustodianCollection } from "@/config/tags";

const getCustodianCollections = async (
  custodianPid: string,
  args?: Pick<ReadArgs, "params">,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> => {
  const tag = getTagCustodianCollection(custodianPid);
  const url = API_ROUTES.custodianCollections(custodianPid);

  return await apiGet<ApiResponse<Paginated<CollectionWithHosts>>>({
    url,
    tags: [tag],
    params: args?.params,
    cacheOptions: { useCache: false },
  });
};

export default getCustodianCollections;
