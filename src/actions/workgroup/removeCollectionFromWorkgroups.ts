"use server";

import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { RemoveCollectionFromWorkgroupsPost, ApiResponse } from "@/types/api";

const removeCollectionFromWorkgroups = async (
  payload: RemoveCollectionFromWorkgroupsPost,
): Promise<void> => {
  const { token } = await requireSession();
  await Promise.all(
    payload.workgroup_ids.map(async (workgroup_id) =>
      apiDelete<ApiResponse<number>>(
        token,
        API_ROUTES.collectionWorkgroup(payload.id, workgroup_id),
      ),
    ),
  );
};

export default removeCollectionFromWorkgroups;
