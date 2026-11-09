"use server";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { Code, ApiResponse } from "@/types/api";

const getCodes = async (domain: string): Promise<ApiResponse<Code[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Code[]>>(token, API_ROUTES.getCodes(domain));
};

export default getCodes;
