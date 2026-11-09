"use server";

import { ApiResponse, SignInResponse } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/server/api";
import { ApiError } from "@/lib/https";
import { setAccessTokenCookie } from "@/lib/authCookie";

const ssoExchange = async (code: string): Promise<boolean> => {
  try {
    const response = await apiPost<
      ApiResponse<SignInResponse>,
      { code: string }
    >(null, API_ROUTES.ssoExchange, { code });

    const token = response.data?.access_token;

    return token ? setAccessTokenCookie(token) : false;
  } catch (error) {
    if (error instanceof ApiError) {
      return false;
    }

    throw error;
  }
};

export default ssoExchange;
