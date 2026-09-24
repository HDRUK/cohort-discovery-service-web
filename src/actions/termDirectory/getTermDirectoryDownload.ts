"use server";

import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { TermDirectoryEntry, ApiResponse } from "@/types/api";

const getTermDirectoryDownload = async (): Promise<
  ApiResponse<TermDirectoryEntry>
> => {
  const result = await apiGet<ApiResponse<TermDirectoryEntry>>({
    url: API_ROUTES.termDirectoryDownload,
  });

  return result;
};

export default getTermDirectoryDownload;
