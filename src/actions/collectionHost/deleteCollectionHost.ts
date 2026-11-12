"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CollectionHost, ApiResponse } from "@/types/api";

const deleteCollectionHost = async (hostId: number): Promise<void> => {
  const { token } = await requireSession();
  await apiDelete<ApiResponse<CollectionHost>>(
    token,
    API_ROUTES.collectionHost(hostId),
  );
  refresh();
};

export default deleteCollectionHost;
