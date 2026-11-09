"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

const deleteRegressionTest = async (pid: string) => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<[]>>(token, API_ROUTES.regressionTest(pid));
  refresh();
};

export default deleteRegressionTest;
