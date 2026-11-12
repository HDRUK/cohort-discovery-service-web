"use server";

import { refresh } from "next/cache";
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

  refresh();
  return result;
};

export default deleteCollections;
