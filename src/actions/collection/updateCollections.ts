"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import {
  addCollectionToWorkgroupIds,
  removeCollectionFromWorkgroupIds,
  toTransitionState,
  transitionCollectionIds,
} from "@/server/mutations/collections";
import { runSaveSteps, SaveStep } from "@/server/mutations/runSaveSteps";
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
    ...changes.map(
      ({ id, name, addWorkgroupIds, removeWorkgroupIds }): SaveStep => [
        "workgroups",
        async () => {
          await addCollectionToWorkgroupIds(token, id, addWorkgroupIds);
          await removeCollectionFromWorkgroupIds(token, id, removeWorkgroupIds);
        },
        { id, name },
      ],
    ),
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

  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.workgroups);

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
