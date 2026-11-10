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
import { pick } from "@/utils/pick";

export const COLLECTION_FIELDS = [
  "name",
  "description",
  "type",
  "host_id",
  "url",
  "custodian_id",
  "status",
  "pid",
  "model_state",
  "is_synthetic",
  "location_enabled",
  "death_enabled",
] as const;

export const COLLECTION_CONFIG_FIELDS = [
  "run_time_hour",
  "run_time_minute",
  "frequency_mode",
  "run_time_frequency",
  "enabled",
  "type",
] as const;

const TRANSITION_FIELDS = ["state"] as const;

export const updateCollectionDetails = async (
  token: string,
  id: number,
  payload: Partial<CreateCollectionPost>,
  payloadConfig: Partial<CreateCollectionConfigPost>,
): Promise<CollectionWithHosts> => {
  const { data } = await apiPut<
    ApiResponse<CollectionWithHosts>,
    Partial<CreateCollectionPost>
  >(token, API_ROUTES.collection(id), pick(payload, COLLECTION_FIELDS));
  await apiPut<ApiResponse<Collection>, Partial<CreateCollectionConfigPost>>(
    token,
    API_ROUTES.collectionConfigItem(data.config.id),
    pick(payloadConfig, COLLECTION_CONFIG_FIELDS),
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
        pick(payload, TRANSITION_FIELDS),
      ),
    ),
  );
};
