"use server";

import { getRegressionTests as readRegressionTests } from "@/server/data/regressionTests";
import { ApiResponse, RegressionTest } from "@/types/api";

const getRegressionTests = async (): Promise<ApiResponse<RegressionTest[]>> =>
  readRegressionTests();

export default getRegressionTests;
