"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { DEFAULT_REVALIDATE } from "@/config/defaults";

const getCustodianCollections = async (
  custodianPid: string,
  params?: URLSearchParams
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.custodianCollections(custodianPid);
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(url, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: [
        `collections-${custodianPid}`,
        `collections-${custodianPid}-${queryString}`,
        key,
      ],
    },
    cache: "force-cache",
  });
};

export default getCustodianCollections;
