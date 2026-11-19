"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";

const restoreCollectionHost = async (
  hostId: number,
): Promise<ApiResponse<CollectionHost>> => {
  const { token } = await requireSession();
  const res = await apiPut<ApiResponse<CollectionHost>, undefined>(
    token,
    API_ROUTES.restoreCollectionHost(hostId),
    undefined,
    { errorMode: ErrorMode.RESULT },
  );
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.collections);
  return res;
};

export default restoreCollectionHost;
