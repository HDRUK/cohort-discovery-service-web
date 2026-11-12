"use server";

import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionToWorkgroupsPost, ApiResponse } from "@/types/api";

const addCollectionToWorkgroups = async (
  payload: AddCollectionToWorkgroupsPost,
): Promise<ApiResponse<number>[]> => {
  const { token } = await requireSession();
  return await Promise.all(
    payload.workgroup_ids.map(async (workgroup_id) =>
      apiPost<ApiResponse<number>, { workgroup_id: number }>(
        token,
        API_ROUTES.collectionWorkgroups(payload.id),
        { workgroup_id: workgroup_id },
      ),
    ),
  );
};

export default addCollectionToWorkgroups;
