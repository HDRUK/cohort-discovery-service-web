"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CollectionHost,
  UpdateCollectionHostPayload,
  ApiResponse,
} from "@/types/api";

const updateCollectionHost = async (
  hostId: number,
  payload: UpdateCollectionHostPayload,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<CollectionHost>, UpdateCollectionHostPayload>(
    token,
    API_ROUTES.collectionHost(hostId),
    payload,
  );
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.collections);
};

export default updateCollectionHost;
