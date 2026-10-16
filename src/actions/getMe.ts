"use server";

import { apiGet, RequestOptions } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { User, ApiResponse } from "@/types/api";
import { getTokenUser } from "@/lib/auth";
import { getTagUserProfile } from "@/config/tags";

const getMe = async (
  options: RequestOptions<undefined> = {},
): Promise<ApiResponse<User>> => {
  const { user } = await getTokenUser();
  return await apiGet<ApiResponse<User>>({
    url: API_ROUTES.getMe,
    tags: [getTagUserProfile(user.id)],
    options,
  });
};

export default getMe;
