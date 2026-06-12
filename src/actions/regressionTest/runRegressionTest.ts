"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RunRegressionTestResponse } from "@/types/api";

const runRegressionTest = async (
  pid: string,
  collectionPid?: string,
): Promise<ApiResponse<RunRegressionTestResponse>> => {
  if (collectionPid) {
    return apiPost<ApiResponse<RunRegressionTestResponse>, undefined>(
      API_ROUTES.runRegressionTestSingle(pid, collectionPid),
    );
  }

  return apiPost<ApiResponse<RunRegressionTestResponse>, undefined>(
    API_ROUTES.runRegressionTest(pid),
  );
};

export default runRegressionTest;
