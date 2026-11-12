"use server";

import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, DistributionType, Query } from "@/types/api";

interface CreateDistributionPost {
  query_type: DistributionType;
}

const rerunDistributions = async (
  pid: string,
  payload: CreateDistributionPost,
): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  return await apiPost<ApiResponse<Query>, CreateDistributionPost>(
    token,
    API_ROUTES.rerunDistributions(pid),
    payload,
  );
};

export default rerunDistributions;
