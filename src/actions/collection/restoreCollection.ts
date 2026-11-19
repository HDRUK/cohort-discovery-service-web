"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Collection } from "@/types/api";

const restoreCollection = async (
  id: number | string,
): Promise<ApiResponse<Collection>> => {
  const { token } = await requireSession();
  const res = await apiPut<ApiResponse<Collection>, undefined>(
    token,
    API_ROUTES.restoreCollection(id),
    undefined,
    { errorMode: ErrorMode.RESULT },
  );
  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  return res;
};

export default restoreCollection;
