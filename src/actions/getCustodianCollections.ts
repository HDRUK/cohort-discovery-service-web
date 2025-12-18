"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { DEFAULT_REVALIDATE } from "@/config/defaults";

const getCustodianCollections = async (
  custodianPid: string,
  params?: URLSearchParams,
  useCache: boolean = true
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.custodianCollections(custodianPid);
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const res = await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(url, {
    next: {
      revalidate: useCache ? DEFAULT_REVALIDATE : undefined,
      tags: [
        "collections-admin",
        `collections-${custodianPid}`,
        `collections-${custodianPid}-${queryString}`,
        key,
      ],
    },
    cache: useCache ? "force-cache" : undefined,
  });

  return res;
};

export default getCustodianCollections;
