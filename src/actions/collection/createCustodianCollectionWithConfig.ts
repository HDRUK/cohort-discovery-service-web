"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  Collection,
  CreateCollectionConfigPost,
  CreateCollectionPost,
} from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const createCustodianCollectionWithConfig = async (
  custodianPid: string,
  payload: CreateCollectionPost,
  payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
): Promise<Collection> => {
  const { data } = await apiPost<ApiResponse<Collection>, CreateCollectionPost>(
    API_ROUTES.custodianCollections(custodianPid),
    payload,
  );
  await apiPost<ApiResponse<Collection>, CreateCollectionConfigPost>(
    API_ROUTES.collectionConfig,
    { ...payloadConfig, collection_id: data.id },
  );
  await revalidateCollections(custodianPid);
  return data;
};

export default createCustodianCollectionWithConfig;