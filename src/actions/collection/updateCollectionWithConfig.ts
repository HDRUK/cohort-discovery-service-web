"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Collection,
  CollectionWithHosts,
  CreateCollectionConfigPost,
  CreateCollectionPost,
} from "@/types/api";

const updateCollectionWithConfig = async (
  id: number,
  payload: Partial<CreateCollectionPost>,
  payloadConfig: Partial<CreateCollectionConfigPost>,
  refreshCache = true,
): Promise<CollectionWithHosts> => {
  const { token } = await requireSession();
  const { data } = await apiPut<
    ApiResponse<CollectionWithHosts>,
    Partial<CreateCollectionPost>
  >(token, API_ROUTES.collection(id), payload);
  await apiPut<ApiResponse<Collection>, Partial<CreateCollectionConfigPost>>(
    token,
    API_ROUTES.collectionConfigItem(data.config.id),
    payloadConfig,
  );
  if (refreshCache) refresh();
  return data;
};

export default updateCollectionWithConfig;
