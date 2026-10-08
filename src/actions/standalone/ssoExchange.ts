"use server";

import { ApiResponse, SignInResponse } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/lib/apiClient";
import { ApiError } from "@/lib/https";
import { setAuthCookie } from "./setAuthCookie";

const ssoExchange = async (code: string): Promise<boolean> => {
  try {
    const response = await apiPost<ApiResponse<SignInResponse>, { code: string }>(
      API_ROUTES.ssoExchange,
      { code },
    );

    const token = response.data?.access_token;

    if (!token) {
      return false;
    }

    return setAuthCookie(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return false;
    }

    throw error;
  }
};

export default ssoExchange;
