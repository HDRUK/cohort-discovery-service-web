"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
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
  updateTag(CACHE_TAGS.workgroups);
  updateTag(CACHE_TAGS.users);
  updateTag(CACHE_TAGS.currentUser);
  updateTag(CACHE_TAGS.collections);
};

export default removeUserFromWorkgroup;
