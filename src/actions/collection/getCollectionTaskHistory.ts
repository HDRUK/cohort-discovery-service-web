"use server";

import { getCollectionTaskHistory as readCollectionTaskHistory } from "@/server/data/collections";
import { ApiResponse, CollectionTaskHistory, TimeRange } from "@/types/api";

const getCollectionTaskHistory = async (
  pid: string,
  range: TimeRange,
): Promise<ApiResponse<CollectionTaskHistory>> =>
  readCollectionTaskHistory(pid, range);

export default getCollectionTaskHistory;
