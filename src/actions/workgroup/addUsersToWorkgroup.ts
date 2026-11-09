"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddUsersToWorkgroupPost, ApiResponse } from "@/types/api";

const addUsersToWorkgroup = async (
  payload: AddUsersToWorkgroupPost,
): Promise<number[]> => {
  const { token } = await requireSession();
  const results = await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddUsersToWorkgroupPost>(
        token,
        API_ROUTES.userWorkgroups(id),
        payload,
      ),
    ),
  );
  refresh();
  return results.map((r) => r.data);
};

export default addUsersToWorkgroup;
