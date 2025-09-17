"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, Paginated, CollectionWithHosts } from "../types/api";
import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";

const getCustodianCollections = async (
  custodianPid: string
): Promise<ApiResponse<Paginated<CollectionWithHosts[]>>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);
  return await apiGet<ApiResponse<Paginated<CollectionWithHosts[]>>>(
    API_ROUTES.custodianCollections(custodianPid),
    {
      next: { revalidate: 3600, tags: [`collections-${custodianPid}`, key] },
      cache: "force-cache",
    }
  );
};

export default getCustodianCollections;
