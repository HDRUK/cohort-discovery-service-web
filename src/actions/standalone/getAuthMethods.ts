"use server";

import { apiGetPublic, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, AuthMethod } from "@/types/api";

const getAuthMethods = async (): Promise<AuthMethod[]> => {
  const { data } = await apiGetPublic<ApiResponse<AuthMethod[]>>(
    API_ROUTES.authMethods,
    { errorMode: ErrorMode.RESULT },
  );

  return data ?? [];
};

export default getAuthMethods;
