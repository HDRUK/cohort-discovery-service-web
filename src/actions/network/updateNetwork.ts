"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Network, ApiResponse, UpdateNetworkPost } from "@/types/api";

const updateNetwork = async (
  id: number,
  payload: UpdateNetworkPost,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<Network>, UpdateNetworkPost>(
    token,
    API_ROUTES.network(id),
    payload,
  );
  updateTag(CACHE_TAGS.custodians);
  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.networks);
};

export default updateNetwork;
