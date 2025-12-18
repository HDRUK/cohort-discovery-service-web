"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  ApiResponse,
  Paginated,
  CollectionWithHosts,
  CacheOptions,
} from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { updateTag } from "next/cache";

const getCustodianCollections = async (
  custodianPid: string,
  params?: URLSearchParams,
  cacheOptions?: CacheOptions
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const { fresh = false, force = true } = cacheOptions ?? {};

  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.custodianCollections(custodianPid);
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const tags = [
    `collections-${custodianPid}`,
    ...(queryString ? [`collections-${custodianPid}-${queryString}`] : []),
    key,
  ];

  if (fresh) {
    tags.forEach(updateTag);
  }

  const useCache = force || fresh;

  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(url, {
    cache: useCache ? "force-cache" : "no-store",
    next: useCache ? { tags, revalidate: DEFAULT_REVALIDATE } : undefined,
  });
};

export default getCustodianCollections;
