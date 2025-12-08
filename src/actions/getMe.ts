"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { User, ApiResponse } from "../types/api";
import { getTokenKey } from "@/utils/string";

const getMe = async (token: string): Promise<ApiResponse<User>> => {
  const key = getTokenKey(token);
  return await apiGet<ApiResponse<User>>(API_ROUTES.getMe, {
    next: {
      revalidate: DEFAULT_REVALIDATE,
      tags: ["all", key],
    },
    cache: "force-cache",
  });
};

export default getMe;
