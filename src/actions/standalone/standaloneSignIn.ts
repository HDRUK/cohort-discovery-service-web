"use server";

import { ApiResponse, SignInPost } from "@/types/api";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/lib/apiClient";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/https";

interface SignInResponse {
  access_token: string;
}

const standaloneSignIn = async (payload: SignInPost): Promise<boolean> => {
  try {
    const response = await apiPost<ApiResponse<SignInResponse>, SignInPost>(
      API_ROUTES.signIn,
      payload
    );

    const token = response.data?.access_token;

    if (!token) {
      return false;
    }

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
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
