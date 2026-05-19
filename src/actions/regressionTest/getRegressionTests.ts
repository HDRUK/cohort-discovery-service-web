"use server";

import { TAG_REGRESSION_TESTS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RegressionTest } from "@/types/api";

const getRegressionTests = async (): Promise<ApiResponse<RegressionTest[]>> => {
  return await apiGet<ApiResponse<RegressionTest[]>>({
    url: API_ROUTES.regressionTestsAdmin,
    tags: [TAG_REGRESSION_TESTS],
    cacheOptions: { useCache: false },
  });
};

export default getRegressionTests;
