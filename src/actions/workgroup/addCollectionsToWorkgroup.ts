"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionsToWorkgroupPost, ApiResponse } from "@/types/api";

const addCollectionsToWorkgroup = async (
  payload: AddCollectionsToWorkgroupPost,
): Promise<number[]> => {
  const { token } = await requireSession();
  const results = await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
        token,
        API_ROUTES.collectionWorkgroups(id),
        payload,
      ),
    ),
  );
  updateTag(CACHE_TAGS.workgroups);
  updateTag(CACHE_TAGS.collections);
  return results.map((r) => r.data);
};

export default addCollectionsToWorkgroup;
