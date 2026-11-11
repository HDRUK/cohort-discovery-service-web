"use server";

import { refresh } from "next/cache";
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
  refresh();
};

export default updateNetwork;
