"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RegressionTest, RegressionTestCollectionInput } from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_REGRESSION_TESTS } from "@/config/tags";

interface CreateRegressionTestBody {
  name: string;
  query_definition: RuleGroupType;
  collections: RegressionTestCollectionInput[];
}

const createRegressionTest = async (
  body: CreateRegressionTestBody,
): Promise<ApiResponse<RegressionTest>> => {
  const res = await apiPost<ApiResponse<RegressionTest>, CreateRegressionTestBody>(
    API_ROUTES.regressionTests,
    body,
  );
  await revalidateUserAction(TAG_REGRESSION_TESTS);
  return res;
};

export default createRegressionTest;
