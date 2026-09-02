"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionHealthSeries } from "@/types/api";
import { TimeRange } from "@/modules/CollectionHealth/timeRange";

const getCollectionHealth = async (
  pid: string,
  bin: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionHealthSeries>> => {
  return await apiGet<ApiResponse<CollectionHealthSeries>>({
    url: API_ROUTES.collectionHealth(pid),
    params: new URLSearchParams({ bin, from: range.from, to: range.to }),
    cacheOptions: { useCache: false },
  });
};

export default getCollectionHealth;
