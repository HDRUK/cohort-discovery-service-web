"use server";

import { getTagCodes } from "@/config/tags";
import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { Code, ApiResponse } from "../../types/api";

const getCodes = async (domain: string): Promise<ApiResponse<Code[]>> => {
  return await apiGet<ApiResponse<Code[]>>({
    url: API_ROUTES.getCodes(domain),
    tags: getTagCodes(domain),
  });
};

export default getCodes;
