"use server";

import {
  apiGet,
  CachedGetArgs,
  ErrorMode,
  RequestOptions,
} from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHealthSeries, TimeRange } from "@/types/api";

const getCollectionHealth = async (
  pid: string,
  bin: string,
  range: TimeRange,
  args?: Omit<CachedGetArgs, "url"> & { options?: RequestOptions<undefined> },
): Promise<ApiResponse<CollectionHealthSeries>> => {
  return await apiGet<ApiResponse<CollectionHealthSeries>>({
    url: API_ROUTES.collectionHealth(pid),
    params: new URLSearchParams({ bin, from: range.from, to: range.to }),
    cacheOptions: { useCache: false },
    ...args,
    options: { errorMode: ErrorMode.RESULT, ...args?.options },
  });
};

export default getCollectionHealth;
