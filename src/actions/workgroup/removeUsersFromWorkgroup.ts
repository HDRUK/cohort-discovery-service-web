"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RemoveUsersFromWorkgroupPost } from "@/types/api";

const removeUserFromWorkgroup = async (
  payload: RemoveUsersFromWorkgroupPost,
): Promise<void> => {
  const { token } = await requireSession();
  await Promise.all(
    payload.ids.map(async (id) =>
      apiDelete<ApiResponse<number>>(
        token,
        API_ROUTES.userWorkgroup(id, payload.workgroup_id),
      ),
    ),
  );
  refresh();
};

export default removeUserFromWorkgroup;
