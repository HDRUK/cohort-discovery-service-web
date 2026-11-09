"use server";

import { apiGet, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { User, ApiResponse } from "@/types/api";
import { getTokenUser } from "@/lib/auth";
import { getTagUserProfile } from "@/config/tags";

const getMe = async (errorMode?: ErrorMode): Promise<ApiResponse<User>> => {
  const { user } = await getTokenUser();
  return await apiGet<ApiResponse<User>>({
    url: API_ROUTES.getMe,
    tags: [getTagUserProfile(user.id)],
    options: { errorMode },
  });
};

export default getMe;
