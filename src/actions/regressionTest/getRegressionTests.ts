"use server";

import { TAG_REGRESSION_TESTS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, CacheOptions, RegressionTest } from "@/types/api";

const getRegressionTests = async (
  cacheOptions: CacheOptions = { useCache: false },
): Promise<ApiResponse<RegressionTest[]>> => {
  return await apiGet<ApiResponse<RegressionTest[]>>({
    url: API_ROUTES.regressionTestsAdmin,
    tags: [TAG_REGRESSION_TESTS],
    cacheOptions,
  });
};

export default getRegressionTests;
