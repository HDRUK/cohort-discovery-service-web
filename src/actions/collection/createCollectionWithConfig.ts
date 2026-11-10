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
import {
  COLLECTION_CONFIG_FIELDS,
  COLLECTION_FIELDS,
} from "@/server/mutations/collections";
import { pick } from "@/utils/pick";

const createCollectionWithConfig = async (
  payload: CreateCollectionPost,
  payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
): Promise<Collection> => {
  const { token } = await requireSession();
  try {
    const { data } = await apiPost<
      ApiResponse<Collection>,
      CreateCollectionPost
    >(token, API_ROUTES.collections, pick(payload, COLLECTION_FIELDS));
    await apiPost<ApiResponse<Collection>, CreateCollectionConfigPost>(
      token,
      API_ROUTES.collectionConfig,
      {
        ...pick(payloadConfig, COLLECTION_CONFIG_FIELDS),
        collection_id: data.id,
      },
    );
    return data;
  } finally {
    refresh();
  }
};

export default createCollectionWithConfig;
