"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { RemoveCollectionsFromWorkgroupPost, ApiResponse } from "@/types/api";

const removeCollectionsFromWorkgroup = async (
  payload: RemoveCollectionsFromWorkgroupPost,
): Promise<void> => {
  const { token } = await requireSession();
  try {
    await Promise.all(
      payload.ids.map(async (id) =>
        apiDelete<ApiResponse<number>>(
          token,
          API_ROUTES.collectionWorkgroup(id, payload.workgroup_id),
        ),
      ),
    );
  } finally {
    refresh();
  }
};

export default removeCollectionsFromWorkgroup;
