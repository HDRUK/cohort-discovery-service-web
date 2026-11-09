"use server";

import { getCollectionHealth as readCollectionHealth } from "@/server/data/collections";
import { ApiResponse, CollectionHealthSeries, TimeRange } from "@/types/api";

const getCollectionHealth = async (
  pid: string,
  bin: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionHealthSeries>> =>
  readCollectionHealth(pid, bin, range);

export default getCollectionHealth;
