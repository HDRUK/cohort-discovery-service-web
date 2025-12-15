"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Workgroup } from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";

const getAdminWorkgroups = async (
  params?: URLSearchParams
): Promise<ApiResponse<Workgroup[]>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.adminWorkgroups;
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return await apiGet<ApiResponse<Workgroup[]>>(url, {
    next: {
      revalidate: 3600,
      tags: [`workgroups`, `workgroups-${queryString}`, key],
    },
    cache: "force-cache",
  });
};

export default getAdminWorkgroups;
