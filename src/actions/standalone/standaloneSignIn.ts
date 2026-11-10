"use server";

import { ApiResponse, SignInPost, SignInResponse } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/server/api";
import { ApiError } from "@/lib/https";
import { setAccessTokenCookie } from "@/lib/authCookie";
import { pick } from "@/utils/pick";

const SIGN_IN_FIELDS = ["email", "password"] as const;

const standaloneSignIn = async (payload: SignInPost): Promise<boolean> => {
  try {
    const response = await apiPost<ApiResponse<SignInResponse>, SignInPost>(
      null,
      API_ROUTES.signIn,
      pick(payload, SIGN_IN_FIELDS),
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
