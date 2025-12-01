"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Custodian, ApiResponse } from "../types/api";

const getCustodian = async (
  id: string | number
): Promise<ApiResponse<Custodian>> => {
  return await apiGet<ApiResponse<Custodian>>(API_ROUTES.custodian(id), {
    next: {
      revalidate: 60,
      tags: ["all", "custodians", `custodian-${id}`],
    },
    cache: "force-cache",
  });
};

export default getCustodian;
