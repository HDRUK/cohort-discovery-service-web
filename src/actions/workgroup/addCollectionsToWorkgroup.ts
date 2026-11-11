"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionsToWorkgroupPost, ApiResponse } from "@/types/api";

const addCollectionsToWorkgroup = async (
  payload: AddCollectionsToWorkgroupPost,
): Promise<number[]> => {
  const { token } = await requireSession();
  try {
    const results = await Promise.all(
      payload.ids.map(async (id) =>
        apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
          token,
          API_ROUTES.collectionWorkgroups(id),
          payload,
        ),
      ),
    );
    return results.map((r) => r.data);
  } finally {
    refresh();
  }
};

export default addCollectionsToWorkgroup;
