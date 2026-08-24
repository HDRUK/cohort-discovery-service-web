"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

interface LogClickThroughPost {
  collection_pid: string;
}

const logClickThrough = async (
  queryPid: string,
  collectionPid: string,
): Promise<ApiResponse<null>> => {
  return await apiPost<ApiResponse<null>, LogClickThroughPost>(
    API_ROUTES.queryClickThrough(queryPid),
    { collection_pid: collectionPid },
  );
};

export default logClickThrough;
