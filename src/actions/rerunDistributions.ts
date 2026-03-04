"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, DistributionType, Query } from "@/types/api";

interface CreateDistributionPost {
  query_type: DistributionType;
}

const rerunDistributions = async (
  pid: string,
  payload: CreateDistributionPost,
): Promise<ApiResponse<Query>> => {
  return await apiPost<ApiResponse<Query>, CreateDistributionPost>(
    API_ROUTES.rerunDistributions(pid),
    payload,
  );
};

export default rerunDistributions;
