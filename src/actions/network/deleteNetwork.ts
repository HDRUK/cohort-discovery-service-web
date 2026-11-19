"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Network } from "@/types/api";

const deleteNetwork = async (id: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<Network>>(token, API_ROUTES.network(id));
  updateTag(CACHE_TAGS.custodians);
  updateTag(CACHE_TAGS.collections);
};

export default deleteNetwork;
