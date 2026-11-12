"use server";

import { getTokenUser } from "@/lib/auth";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, ApiResponse, ReadArgs } from "@/types/api";
import { getTagsUserCollections, TAG_COLLECTIONS } from "@/config/tags";

const getUserCollections = async (
  args?: ReadArgs,
): Promise<ApiResponse<Collection[]>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();

  return await apiGet<ApiResponse<Collection[]>>({
    url: API_ROUTES.userCollections,
    tags: [getTagsUserCollections(userId), TAG_COLLECTIONS],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getUserCollections;
