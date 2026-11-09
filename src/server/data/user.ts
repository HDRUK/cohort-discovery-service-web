import "server-only";

import { cacheLife } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { USER_DATA_CACHE_LIFE } from "@/server/cacheProfiles";
import { requireSession } from "@/server/session";
import { ApiResponse, User } from "@/types/api";

export const toCurrentUser = (me: User): User => ({
  id: me.id,
  email: me.email,
  name: me.name,
  email_verified_at: me.email_verified_at,
  new_user_status: me.new_user_status,
  roles: me.roles,
  custodians: me.custodians,
  workgroups: me.workgroups,
  identities: me.identities,
  query_quota: me.query_quota,
  created_at: me.created_at,
  updated_at: me.updated_at,
});

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const { token } = await requireSession();
  const response = await apiGet<ApiResponse<User>>(token, API_ROUTES.getMe, {
    errorMode: ErrorMode.RESULT,
  });

  return response.data
    ? { ...response, data: toCurrentUser(response.data) }
    : response;
};
