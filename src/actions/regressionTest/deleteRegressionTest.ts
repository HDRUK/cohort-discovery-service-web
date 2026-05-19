"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_REGRESSION_TESTS } from "@/config/tags";

const deleteRegressionTest = async (pid: string) => {
  await apiDelete<ApiResponse<[]>>(API_ROUTES.regressionTest(pid));
  await revalidateUserAction(TAG_REGRESSION_TESTS);
};

export default deleteRegressionTest;
