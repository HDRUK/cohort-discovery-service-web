"use server";

import { apiGet, RequestOptions } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { User, ApiResponse } from "@/types/api";

const getMe = async (
  options: RequestOptions<undefined> = {},
): Promise<ApiResponse<User>> => {
  return await apiGet<ApiResponse<User>>({ url: API_ROUTES.getMe, options });
};

export default getMe;
