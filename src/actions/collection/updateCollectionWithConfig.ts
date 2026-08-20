"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Collection,
  CollectionWithHosts,
  CreateCollectionConfigPost,
  CreateCollectionPost,
} from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const updateCollectionWithConfig = async (
  id: number,
  payload: Partial<CreateCollectionPost>,
  payloadConfig: Partial<CreateCollectionConfigPost>,
  refreshCache = true,
): Promise<CollectionWithHosts> => {
  const { data } = await apiPut<
    ApiResponse<CollectionWithHosts>,
    Partial<CreateCollectionPost>
  >(API_ROUTES.collection(id), payload);
  await apiPut<ApiResponse<Collection>, Partial<CreateCollectionConfigPost>>(
    `${API_ROUTES.collectionConfig}/${data.config.id}`,
    payloadConfig,
  );
  if (refreshCache) await revalidateCollections(data.custodian.pid);
  return data;
};

export default updateCollectionWithConfig;