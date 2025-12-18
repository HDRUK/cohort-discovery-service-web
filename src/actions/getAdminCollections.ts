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

const getAdminCollections = async (
  params?: URLSearchParams,
  cacheOptions?: CacheOptions
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const { fresh = false, force = true } = cacheOptions ?? {};
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);

  let url = API_ROUTES.adminCollections;
  const queryString = params?.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const tags = [
    `collections-admin`,
    ...(queryString ? [`collections-admin-${queryString}`] : []),
    key,
  ];

  if (fresh) {
    tags.forEach(updateTag);
  }

  const useCache = force || fresh;

  console.log("called getAdminCollections", tags, { force }, { fresh });

  const res = await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(url, {
    cache: useCache ? "force-cache" : "no-store",
    next: useCache ? { tags, revalidate: DEFAULT_REVALIDATE } : undefined,
  });

  return res;
};

export default getAdminCollections;
