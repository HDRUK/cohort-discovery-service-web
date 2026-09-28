"use server";

import { apiGetPublic, ErrorMode } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, SsoProvider } from "@/types/api";

const getSsoProviders = async (): Promise<SsoProvider[]> => {
  const { data, error } = await apiGetPublic<ApiResponse<SsoProvider[]>>(
    API_ROUTES.ssoProviders,
    { errorMode: ErrorMode.RESULT },
  );

  if (error?.code === 404) return [];
  return data ?? [];
};

export default getSsoProviders;
