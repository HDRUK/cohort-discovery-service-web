"use server";

import { apiDelete, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_REGRESSION_TESTS } from "@/config/tags";

const deleteRegressionTest = async (pid: string): Promise<ApiResponse<[]>> => {
  const res = await apiDelete<ApiResponse<[]>>(API_ROUTES.regressionTest(pid), {
    cache: "no-store",
    errorMode: ErrorMode.RESULT,
  });
  console.log(API_ROUTES.regressionTest(pid));
  console.log({ res });
  await revalidateUserAction(TAG_REGRESSION_TESTS);
  return res;
};

export default deleteRegressionTest;
