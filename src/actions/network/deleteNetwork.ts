"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Network } from "@/types/api";

const deleteNetwork = async (id: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<Network>>(token, API_ROUTES.network(id));
  refresh();
};

export default deleteNetwork;
