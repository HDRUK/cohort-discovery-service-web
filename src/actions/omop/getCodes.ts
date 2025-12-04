"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { Code, ApiResponse } from "../../types/api";

const getCodes = async (domain: string): Promise<ApiResponse<Code[]>> => {
  return await apiGet<ApiResponse<Code[]>>(API_ROUTES.getCodes(domain), {
    next: { revalidate: DEFAULT_REVALIDATE, tags: ["omop", domain] },
    cache: "force-cache",
  });
};

export default getCodes;
