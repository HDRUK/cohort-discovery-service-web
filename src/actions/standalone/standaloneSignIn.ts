"use server";

import { ApiResponse, SignInPost, SignInResponse } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/lib/apiClient";
import { ApiError } from "@/lib/https";
import { setAccessTokenCookie } from "@/lib/authCookie";

const standaloneSignIn = async (payload: SignInPost): Promise<boolean> => {
  try {
    const response = await apiPost<ApiResponse<SignInResponse>, SignInPost>(
      API_ROUTES.signIn,
      payload,
    );

    const token = response.data?.access_token;

    return token ? setAccessTokenCookie(token) : false;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return false;
    }

    throw error;
  }
};

export default standaloneSignIn;
