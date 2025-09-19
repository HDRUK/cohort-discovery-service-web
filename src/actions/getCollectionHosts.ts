"use server";

import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, CollectionHost } from "../types/api";

const getCollectionHosts = async (
  custodianPid: string
): Promise<ApiResponse<CollectionHost[]>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);
  return await apiGet<ApiResponse<CollectionHost[]>>(
    API_ROUTES.custodianCollectionHosts(custodianPid),
    {
      next: {
        revalidate: 3600,
        tags: ["collection-hosts", `collection-hosts-${custodianPid}`, key],
      },
      cache: "force-cache",
    }
  );
};

export default getCollectionHosts;
