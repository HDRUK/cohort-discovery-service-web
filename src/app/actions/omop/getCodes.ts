"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { Code, ApiResponse } from "../../types/api";

const getCodes = async (domain: string): Promise<ApiResponse<Code[]>> => {
  return await apiGet<ApiResponse<Code[]>>(API_ROUTES.getCodes(domain));
};

export default getCodes;
