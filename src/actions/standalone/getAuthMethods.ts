"use server";

import { apiGetUncached, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, AuthMethod } from "@/types/api";

const getAuthMethods = async (): Promise<ApiResponse<AuthMethod[]>> => {
  try {
    const response = await apiGetUncached<ApiResponse<AuthMethod[]>>(
      API_ROUTES.authMethods,
      { errorMode: ErrorMode.RESULT },
    );

    return { ...response, data: response.data ?? [] };
  } catch (error) {
    console.error("Could not load sign-in methods:", error);

    return {
      message: "Could not load sign-in methods",
      data: [],
      error: { text: "Could not load sign-in methods", code: 500 },
    };
  }
};

export default getAuthMethods;
