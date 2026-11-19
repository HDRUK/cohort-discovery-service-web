"use server";

import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RunRegressionTestResponse } from "@/types/api";

const runRegressionTest = async (
  pid: string,
  collectionPid?: string,
): Promise<ApiResponse<RunRegressionTestResponse>> => {
  const { token } = await requireSession();
  if (collectionPid) {
    return apiPost<ApiResponse<RunRegressionTestResponse>, undefined>(
      token,
      API_ROUTES.runRegressionTestSingle(pid, collectionPid),
    );
  }

  return apiPost<ApiResponse<RunRegressionTestResponse>, undefined>(
    token,
    API_ROUTES.runRegressionTest(pid),
  );
};

export default runRegressionTest;
