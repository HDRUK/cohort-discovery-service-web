"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet, CachedGetArgs } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, ApiResponse } from "@/types/api";
import { getTagsUserCollections, TAG_COLLECTIONS } from "@/config/tags";

const getUserCollections = async (
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Collection[]>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();

  return await apiGet<ApiResponse<Collection[]>>({
    url: API_ROUTES.userCollections,
    tags: [getTagsUserCollections(userId), TAG_COLLECTIONS],
    ...args,
  });
};

export default getUserCollections;
