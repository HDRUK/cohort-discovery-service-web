"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { DEFAULT_REVALIDATE } from "@/config/defaults";

const getAdminCollections = async (
  params?: URLSearchParams,
  useCache = true
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.adminCollections;
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(url, {
    next: {
      revalidate: useCache ? DEFAULT_REVALIDATE : undefined,
      tags: [`collections`, `collections-${queryString}`, key],
    },
    cache: useCache ? "force-cache" : "no-store",
  });
};

export default getAdminCollections;
