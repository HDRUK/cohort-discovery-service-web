"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionsToWorkgroupPost, ApiResponse } from "@/types/api";
import { pick } from "@/utils/pick";

const WORKGROUP_COLLECTIONS_FIELDS = ["ids", "workgroup_id"] as const;

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
          pick(payload, WORKGROUP_COLLECTIONS_FIELDS),
        ),
      ),
    );
    return results.map((r) => r.data);
  } finally {
    refresh();
  }
};

export default addCollectionsToWorkgroup;
