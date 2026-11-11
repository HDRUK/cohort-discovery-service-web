"use server";

import { refresh } from "next/cache";
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
  try {
    const { data } = await apiPost<
      ApiResponse<Collection>,
      CreateCollectionPost
    >(token, API_ROUTES.collections, payload);
    await apiPost<ApiResponse<Collection>, CreateCollectionConfigPost>(
      token,
      API_ROUTES.collectionConfig,
      { ...payloadConfig, collection_id: data.id },
    );
    return data;
  } finally {
    refresh();
  }
};

export default createCollectionWithConfig;
