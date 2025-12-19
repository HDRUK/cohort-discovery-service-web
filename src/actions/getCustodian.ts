"use server";

import { getCustodianTag, TAG_CUSTODIANS } from "@/config/tags";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Custodian, ApiResponse } from "../types/api";

const getCustodian = async (
  id: string | number
): Promise<ApiResponse<Custodian>> => {
  return await apiGet<ApiResponse<Custodian>>({
    url: API_ROUTES.custodian(id),
    tags: [TAG_CUSTODIANS, getCustodianTag(id)],
  });
};

export default getCustodian;
