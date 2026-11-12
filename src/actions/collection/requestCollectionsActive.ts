"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { transitionCollectionIds } from "@/server/mutations/collections";
import { requireSession } from "@/server/session";
import { CollectionStatus } from "@/types/api";

const PENDING_STATE = CollectionStatus[CollectionStatus.PENDING].toLowerCase();

const requestCollectionsActive = async (ids: number[]): Promise<void> => {
  const { token } = await requireSession();
  try {
    await transitionCollectionIds(token, ids, { state: PENDING_STATE });
  } finally {
    updateTag(CACHE_TAGS.collections);
    updateTag(CACHE_TAGS.collectionHosts);
  }
};

export default requestCollectionsActive;
