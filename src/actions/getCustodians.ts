"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Custodian, ApiResponse } from "../types/api";

const getCustodians = async (): Promise<ApiResponse<Custodian[]>> => {
  return await apiGet<ApiResponse<Custodian[]>>(API_ROUTES.custodians, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: ["all", "custodians"],
    },
    cache: "force-cache",
  });
};

export default getCustodians;
