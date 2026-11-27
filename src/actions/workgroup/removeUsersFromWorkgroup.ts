"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiDelete, ErrorMode } from "@/server/api";
import {
  editFailures,
  runMemberEdit,
} from "@/server/mutations/workgroupMembers";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { MembershipEditResult } from "@/types/accessPolicy";
import { ApiResponse, RemoveUsersFromWorkgroupPost } from "@/types/api";

const removeUserFromWorkgroup = async (
  payload: RemoveUsersFromWorkgroupPost,
): Promise<MembershipEditResult> => {
  const { token } = await requireSession();
  const responses = await Promise.all(
    payload.ids.map((id) =>
      runMemberEdit(id, () =>
        apiDelete<ApiResponse<number>>(
          token,
          API_ROUTES.userWorkgroup(id, payload.workgroup_id),
          { errorMode: ErrorMode.RESULT },
        ),
      ),
    ),
  );
  updateTag(CACHE_TAGS.workgroups);
  updateTag(CACHE_TAGS.users);
  updateTag(CACHE_TAGS.currentUser);
  updateTag(CACHE_TAGS.collections);
  return { failed: editFailures(responses) };
};

export default removeUserFromWorkgroup;
