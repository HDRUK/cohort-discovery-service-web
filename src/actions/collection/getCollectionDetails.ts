"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionDetails } from "@/types/api";
import { getTagCollection, TAG_COLLECTIONS_ADMIN } from "@/config/tags";

const fetchCollectionDetails = async (
  pid: string,
): Promise<CollectionDetails> => {
  const res = await apiGet<ApiResponse<CollectionDetails>>({
    url: `${API_ROUTES.collection(pid)}/details`,
    tags: [TAG_COLLECTIONS_ADMIN, getTagCollection(pid)],
    revalidate: false,
    includeUserTag: false,
  });
  return res.data;
};

const getCollectionDetails = async (
  pid: string,
): Promise<CollectionDetails> => {
  return await fetchCollectionDetails(pid);
};

export const getCollectionDetailsBulk = async (
  pids: string[],
): Promise<Record<string, CollectionDetails>> => {
  const entries = await Promise.all(
    pids.map(async (pid) => [pid, await fetchCollectionDetails(pid)] as const),
  );

  return Object.fromEntries(entries);
};

export default getCollectionDetails;
