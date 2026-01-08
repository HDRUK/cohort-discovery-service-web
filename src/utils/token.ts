import { Roles, TokenUser } from "@/types/api";

export const isAdmin = (token_user: TokenUser | undefined | null) =>
  token_user?.cohort_discovery_roles.includes(Roles.ADMIN) ||
  token_user?.cohort_discovery_roles.includes(Roles.SYSTEM_ADMIN) ||
  false;
