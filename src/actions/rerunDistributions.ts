"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, DistributionType, Query } from "@/types/api";
import { pick } from "@/utils/pick";

const DISTRIBUTION_FIELDS = ["query_type"] as const;

interface CreateDistributionPost {
  query_type: DistributionType;
}

const rerunDistributions = async (
  pid: string,
  payload: CreateDistributionPost,
): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  const res = await apiPost<ApiResponse<Query>, CreateDistributionPost>(
    token,
    API_ROUTES.rerunDistributions(pid),
    pick(payload, DISTRIBUTION_FIELDS),
  );
  refresh();
  return res;
};

export default rerunDistributions;
