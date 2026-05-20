"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RunRegressionTestResponse } from "@/types/api";

const runRegressionTest = async (
  pid: string,
  collectionPid?: string,
): Promise<ApiResponse<RunRegressionTestResponse>> => {
  return apiPost<
    ApiResponse<RunRegressionTestResponse>,
    { collection_pid: string } | undefined
  >(
    API_ROUTES.runRegressionTest(pid),
    collectionPid ? { collection_pid: collectionPid } : undefined,
  );
};

export default runRegressionTest;
