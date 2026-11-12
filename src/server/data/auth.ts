import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { ApiResponse, AuthMethod } from "@/types/api";

const SIGN_IN_METHODS_UNAVAILABLE = "Could not load sign-in methods";

const fetchAuthMethods = async (): Promise<ApiResponse<AuthMethod[]>> => {
  "use cache";
  cacheLife("hours");

  const response = await apiGet<ApiResponse<AuthMethod[]>>(
    null,
    API_ROUTES.authMethods,
  );
  return { ...response, data: response.data ?? [] };
};

export const getAuthMethods = async (): Promise<ApiResponse<AuthMethod[]>> => {
  try {
    return await fetchAuthMethods();
  } catch (error) {
    console.error(`${SIGN_IN_METHODS_UNAVAILABLE}:`, error);

    return {
      message: SIGN_IN_METHODS_UNAVAILABLE,
      data: [],
      error: { text: SIGN_IN_METHODS_UNAVAILABLE, code: 500 },
    };
  }
};
