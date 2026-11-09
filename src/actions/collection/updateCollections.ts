"use server";

import { refresh } from "next/cache";
import {
  addCollectionToWorkgroupIds,
  removeCollectionFromWorkgroupIds,
  toTransitionState,
  transitionCollectionIds,
} from "@/server/mutations/collections";
import { runSaveSteps } from "@/server/mutations/runSaveSteps";
import { requireSession } from "@/server/session";
import {
  CollectionSaveResult,
  CollectionStatus,
  CollectionWorkgroupChanges,
} from "@/types/api";

const updateCollections = async (
  changes: CollectionWorkgroupChanges[],
  status?: CollectionStatus,
): Promise<CollectionSaveResult> => {
  const { token } = await requireSession();

  const failure = await runSaveSteps([
    [
      "workgroups",
      async () => {
        for (const { id, addWorkgroupIds, removeWorkgroupIds } of changes) {
          await addCollectionToWorkgroupIds(token, id, addWorkgroupIds);
          await removeCollectionFromWorkgroupIds(token, id, removeWorkgroupIds);
        }
      },
    ],
    [
      "status",
      async () => {
        if (status === undefined) return;
        await transitionCollectionIds(
          token,
          changes.map(({ id }) => id),
          { state: toTransitionState(status) },
        );
      },
    ],
  ]);

  refresh();

  return (
    failure ?? {
      ok: true,
      workgroupsAdded: changes.reduce(
        (total, { addWorkgroupIds }) => total + addWorkgroupIds.length,
        0,
      ),
      workgroupsRemoved: changes.reduce(
        (total, { removeWorkgroupIds }) => total + removeWorkgroupIds.length,
        0,
      ),
      statusChanged: status !== undefined,
    }
  );
};

export default updateCollections;
