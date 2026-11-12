"use server";

import { getCollectionDetails } from "@/server/data/collections";
import { ApiResponse, CollectionDetails } from "@/types/api";

export type CollectionDetailsMap = Record<string, CollectionDetails>;

const getMultipleCollectionDetails = async (
  pids: string[],
): Promise<ApiResponse<CollectionDetailsMap>> => {
  const uniquePids = [...new Set(pids)].filter(Boolean);

  const results = await Promise.all(
    uniquePids.map(
      async (pid) => [pid, await getCollectionDetails(pid)] as const,
    ),
  );

  return {
    data: Object.fromEntries(results),
    message: "Fetched collection details",
  };
};

export default getMultipleCollectionDetails;
