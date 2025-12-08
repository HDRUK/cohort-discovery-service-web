"use server";

import { cookies } from "next/headers";
import { getTokenKey } from "@/utils/string";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, CollectionHost } from "../types/api";
import { DEFAULT_REVALIDATE } from "@/config/defaults";

const getCollectionHosts = async (): Promise<ApiResponse<CollectionHost[]>> => {
  const token = (await cookies()).get("token")?.value || "";
  const key = getTokenKey(token);
  return await apiGet<ApiResponse<CollectionHost[]>>(
    API_ROUTES.collectionHosts,
    {
      next: {
        revalidate: DEFAULT_REVALIDATE,
        tags: ["collection-hosts", key],
      },
      cache: "force-cache",
    }
  );
};

export default getCollectionHosts;
