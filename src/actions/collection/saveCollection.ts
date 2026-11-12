"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import {
  addCollectionToWorkgroupIds,
  removeCollectionFromWorkgroupIds,
  toTransitionState,
  transitionCollectionIds,
  updateCollectionDetails,
} from "@/server/mutations/collections";
import { runSaveSteps } from "@/server/mutations/runSaveSteps";
import { requireSession } from "@/server/session";
import {
  CollectionSaveResult,
  CollectionStatus,
  CreateCollectionConfigPost,
  CreateCollectionPost,
} from "@/types/api";

interface SaveCollectionChanges {
  collection: Partial<CreateCollectionPost>;
  config: Partial<CreateCollectionConfigPost>;
  addWorkgroupIds: number[];
  removeWorkgroupIds: number[];
  status?: CollectionStatus;
}

const saveCollection = async (
  id: number,
  {
    collection,
    config,
    addWorkgroupIds,
    removeWorkgroupIds,
    status,
  }: SaveCollectionChanges,
): Promise<CollectionSaveResult> => {
  const { token } = await requireSession();

  const failure = await runSaveSteps([
    [
      "details",
      async () => {
        await updateCollectionDetails(token, id, collection, config);
      },
    ],
    [
      "workgroups",
      async () => {
        await addCollectionToWorkgroupIds(token, id, addWorkgroupIds);
        await removeCollectionFromWorkgroupIds(token, id, removeWorkgroupIds);
      },
    ],
    [
      "status",
      async () => {
        if (status === undefined) return;
        await transitionCollectionIds(token, [id], {
          state: toTransitionState(status),
        });
      },
    ],
  ]);

  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.workgroups);

  return (
    failure ?? {
      ok: true,
      workgroupsAdded: addWorkgroupIds.length,
      workgroupsRemoved: removeWorkgroupIds.length,
      statusChanged: status !== undefined,
    }
  );
};

export default saveCollection;
