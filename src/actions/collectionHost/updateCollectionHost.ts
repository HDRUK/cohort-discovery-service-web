"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CollectionHost,
  UpdateCollectionHostPayload,
  ApiResponse,
} from "@/types/api";
import { pick } from "@/utils/pick";

const COLLECTION_HOST_FIELDS = ["name", "query_context_type"] as const;

const updateCollectionHost = async (
  hostId: number,
  payload: UpdateCollectionHostPayload,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPut<ApiResponse<CollectionHost>, UpdateCollectionHostPayload>(
    token,
    API_ROUTES.collectionHost(hostId),
    pick(payload, COLLECTION_HOST_FIELDS),
  );
  refresh();
};

export default updateCollectionHost;
