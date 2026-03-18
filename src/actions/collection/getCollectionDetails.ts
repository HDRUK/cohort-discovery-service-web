"use server";

import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CollectionDetails } from "@/types/api";
import { getTagCollection } from "@/config/tags";

const getCollectionDetails = async (
  pid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<CollectionDetails>> => {
  return await apiGet<ApiResponse<CollectionDetails>>({
    url: `${API_ROUTES.collection(pid)}/details`,
    tags: [getTagCollection(pid)],
    ...args,
  });
};

export default getCollectionDetails;
