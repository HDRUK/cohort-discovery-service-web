import "server-only";

import { cacheLife } from "next/cache";
import { unstable_rethrow } from "next/navigation";
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

const fetchMe = async (): Promise<ApiResponse<User>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<User>>(token, API_ROUTES.getMe, {
    errorMode: ErrorMode.RESULT,
  });
};

const fetchCachedCurrentUser = async (): Promise<ApiResponse<User>> => {
  "use cache: private";
  cacheLife(USER_DATA_CACHE_LIFE);

  const response = await fetchMe();
  if (response.error) throw new Error(response.error.text);

  return { ...response, data: toCurrentUser(response.data) };
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    return await fetchCachedCurrentUser();
  } catch (error) {
    unstable_rethrow(error);
    return fetchMe();
  }
};
