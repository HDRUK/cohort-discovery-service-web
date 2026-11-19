"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  ApiResponse,
  RegressionTest,
  RegressionTestCollectionInput,
} from "@/types/api";
import { RuleGroupType } from "@/types/rules";

interface UpdateRegressionTestBody {
  name?: string;
  query_definition?: RuleGroupType;
  collections?: RegressionTestCollectionInput[];
}

const updateRegressionTest = async (
  pid: string,
  body: UpdateRegressionTestBody,
): Promise<ApiResponse<RegressionTest>> => {
  const { token } = await requireSession();
  const res = await apiPut<
    ApiResponse<RegressionTest>,
    UpdateRegressionTestBody
  >(token, API_ROUTES.regressionTest(pid), body);
  refresh();
  return res;
};

export default updateRegressionTest;
