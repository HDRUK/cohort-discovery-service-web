"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Collection,
  CreateCollectionConfigPost,
  CreateCollectionPost,
} from "@/types/api";

const createCollectionWithConfig = async (
  payload: CreateCollectionPost,
  payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
): Promise<Collection> => {
  const { token } = await requireSession();
  const { data } = await apiPost<ApiResponse<Collection>, CreateCollectionPost>(
    token,
    API_ROUTES.collections,
    payload,
  );
  await apiPost<ApiResponse<Collection>, CreateCollectionConfigPost>(
    token,
    API_ROUTES.collectionConfig,
    { ...payloadConfig, collection_id: data.id },
  );
  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  return data;
};

export default createCollectionWithConfig;
