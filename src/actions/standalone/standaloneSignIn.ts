"use server";

import { ApiResponse, SignInPost } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/lib/apiClient";
import { cookies, headers } from "next/headers";
import { ApiError } from "@/lib/https";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SignInResponse {
  access_token: string;
}

const standaloneSignIn = async (payload: SignInPost): Promise<boolean> => {
  try {
    const response = await apiPost<ApiResponse<SignInResponse>, SignInPost>(
      API_ROUTES.signIn,
      payload,
    );

    const token = response.data?.access_token;

    const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;
    if (!decoded) {
      return false;
    }
    const exp = decoded.exp ? Math.floor(decoded.exp) : undefined;

    const h = await headers();
    const requestNow = h?.get("x-request-now");
    const now = requestNow !== null ? Math.floor(Number(requestNow)) : 0;
    const skew = 30;

    const maxAge = exp ? Math.max(0, exp - now - skew) : 60 * 60;

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return false;
    }

    throw error;
  }
};

export default standaloneSignIn;
