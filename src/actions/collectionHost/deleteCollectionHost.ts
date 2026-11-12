"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";

const deleteCollectionHost = async (hostId: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<CollectionHost>>(
    token,
    API_ROUTES.collectionHost(hostId),
  );
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.collections);
};

export default deleteCollectionHost;
