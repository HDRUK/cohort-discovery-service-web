"use server";

import { getCollectionDetails as readCollectionDetails } from "@/server/data/collections";
import { CollectionDetails } from "@/types/api";

const getCollectionDetails = async (pid: string): Promise<CollectionDetails> =>
  readCollectionDetails(pid);

export const getCollectionDetailsBulk = async (
  pids: string[],
): Promise<Record<string, CollectionDetails>> => {
  const entries = await Promise.all(
    pids.map(async (pid) => [pid, await readCollectionDetails(pid)] as const),
  );

  return Object.fromEntries(entries);
};

export default getCollectionDetails;
