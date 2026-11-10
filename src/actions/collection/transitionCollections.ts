"use server";

import { refresh } from "next/cache";
import { transitionCollectionIds } from "@/server/mutations/collections";
import { requireSession } from "@/server/session";
import { TransitionCollectionPut } from "@/types/api";

const transitionCollections = async (
  ids: number[],
  payload: TransitionCollectionPut,
): Promise<void> => {
  const { token } = await requireSession();
  try {
    await transitionCollectionIds(token, ids, payload);
  } finally {
    refresh();
  }
};

export default transitionCollections;
