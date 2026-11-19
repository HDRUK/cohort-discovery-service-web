"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CollectionHost,
  CreateCollectionHostPost,
  ApiResponse,
} from "@/types/api";
import { CollectionHostFormValues } from "@/types/forms";

const createCollectionHost = async (
  custodian_id: number,
  { name, context }: CollectionHostFormValues,
): Promise<void> => {
  const { token } = await requireSession();
  await apiPost<ApiResponse<CollectionHost>, CreateCollectionHostPost>(
    token,
    API_ROUTES.collectionHosts,
    {
      name,
      query_context_type: context,
      custodian_id,
    },
  );
  updateTag(CACHE_TAGS.collectionHosts);
  updateTag(CACHE_TAGS.collections);
};

export default createCollectionHost;
