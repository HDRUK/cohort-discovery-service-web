"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, Collection } from "@/types/api";

const deleteCollection = async (id: number | string): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<Collection>>(token, API_ROUTES.collection(id));
  refresh();
};

export default deleteCollection;
