import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiDelete, apiPost, apiPut } from "@/server/api";
import {
  ApiResponse,
  Collection,
  CollectionStatus,
  CollectionWithHosts,
  CreateCollectionConfigPost,
  CreateCollectionPost,
  TransitionCollectionPut,
} from "@/types/api";

export const updateCollectionDetails = async (
  token: string,
  id: number,
  payload: Partial<CreateCollectionPost>,
  payloadConfig: Partial<CreateCollectionConfigPost>,
): Promise<CollectionWithHosts> => {
  const { data } = await apiPut<
    ApiResponse<CollectionWithHosts>,
    Partial<CreateCollectionPost>
  >(token, API_ROUTES.collection(id), payload);
  await apiPut<ApiResponse<Collection>, Partial<CreateCollectionConfigPost>>(
    token,
    API_ROUTES.collectionConfigItem(data.config.id),
    payloadConfig,
  );
  return data;
};

export const addCollectionToWorkgroupIds = async (
  token: string,
  id: number,
  workgroupIds: number[],
): Promise<void> => {
  for (const workgroupId of workgroupIds) {
    await apiPost<ApiResponse<number>, { workgroup_id: number }>(
      token,
      API_ROUTES.collectionWorkgroups(id),
      { workgroup_id: workgroupId },
    );
  }
};

export const removeCollectionFromWorkgroupIds = async (
  token: string,
  id: number,
  workgroupIds: number[],
): Promise<void> => {
  for (const workgroupId of workgroupIds) {
    await apiDelete<ApiResponse<number>>(
      token,
      API_ROUTES.collectionWorkgroup(id, workgroupId),
    );
  }
};

export const toTransitionState = (status: CollectionStatus): string =>
  CollectionStatus[status].toLowerCase();

export const transitionCollectionIds = async (
  token: string,
  ids: number[],
  payload: TransitionCollectionPut,
): Promise<void> => {
  await Promise.all(
    ids.map((id) =>
      apiPut<ApiResponse<Collection>, TransitionCollectionPut>(
        token,
        API_ROUTES.transitionCollection(id),
        payload,
      ),
    ),
  );
};
