"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionDetails } from "@/types/api";
import { getTagCollection } from "@/config/tags";

export type CollectionDetailsMap = Record<string, CollectionDetails>;

const getMultipleCollectionDetails = async (
  pids: string[],
  args?: Omit<CachedGetArgs, "url" | "tags">,
): Promise<ApiResponse<CollectionDetailsMap>> => {
  const uniquePids = [...new Set(pids)].filter(Boolean);

  const results = await Promise.all(
    uniquePids.map(async (pid) => {
      const res = await apiGet<ApiResponse<CollectionDetails>>({
        url: `${API_ROUTES.collection(pid)}/details`,
        tags: [getTagCollection(pid)],
        ...args,
      });

      return [pid, res.data] as const;
    }),
  );

  return {
    data: Object.fromEntries(results),
    message: "Fetched collection details",
  };
};

export default getMultipleCollectionDetails;
