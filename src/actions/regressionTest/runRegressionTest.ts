"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RunRegressionTestResponse } from "@/types/api";

const runRegressionTest = async (
  pid: string,
): Promise<ApiResponse<RunRegressionTestResponse>> => {
  return apiPost<ApiResponse<RunRegressionTestResponse>, undefined>(
    API_ROUTES.runRegressionTest(pid),
    undefined,
  );
};

export default runRegressionTest;
