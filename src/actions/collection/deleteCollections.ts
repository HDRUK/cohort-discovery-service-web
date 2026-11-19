"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { unstable_rethrow } from "next/navigation";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, Collection, DeleteCollectionsResult } from "@/types/api";

const deleteCollections = async (
  ids: number[],
): Promise<DeleteCollectionsResult> => {
  const { token } = await requireSession();
  const result: DeleteCollectionsResult = { deleted: [], failed: [] };

  for (const id of ids) {
    try {
      await apiDelete<ApiResponse<Collection>>(
        token,
        API_ROUTES.collection(id),
      );
      result.deleted.push(id);
    } catch (error) {
      unstable_rethrow(error);
      result.failed.push(id);
    }
  }

  updateTag(CACHE_TAGS.collections);
  updateTag(CACHE_TAGS.collectionHosts);
  return result;
};

export default deleteCollections;
