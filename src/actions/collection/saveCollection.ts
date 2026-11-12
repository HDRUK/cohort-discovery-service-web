"use server";

import { refresh } from "next/cache";
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

  refresh();

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
