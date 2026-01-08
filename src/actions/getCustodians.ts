"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Custodian, ApiResponse } from "../types/api";
import { TAG_CUSTODIANS } from "@/config/tags";

const getCustodians = async (): Promise<ApiResponse<Custodian[]>> => {
  return await apiGet<ApiResponse<Custodian[]>>({
    url: API_ROUTES.custodians,
    tags: [TAG_CUSTODIANS],
  });
};

export default getCustodians;
