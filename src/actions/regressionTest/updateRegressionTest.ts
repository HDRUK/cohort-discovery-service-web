"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RegressionTest, RegressionTestCollectionInput } from "@/types/api";
import { RuleGroupType } from "@/types/rules";
import { revalidateUserAction } from "@/actions/revalidate";
import { TAG_REGRESSION_TESTS } from "@/config/tags";

interface UpdateRegressionTestBody {
  name?: string;
  query_definition?: RuleGroupType;
  collections?: RegressionTestCollectionInput[];
}

const updateRegressionTest = async (
  pid: string,
  body: UpdateRegressionTestBody,
): Promise<ApiResponse<RegressionTest>> => {
  const res = await apiPut<ApiResponse<RegressionTest>, UpdateRegressionTestBody>(
    API_ROUTES.regressionTest(pid),
    body,
  );
  await revalidateUserAction(TAG_REGRESSION_TESTS);
  return res;
};

export default updateRegressionTest;
