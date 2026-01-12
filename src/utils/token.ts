import { TokenUser } from "@/types/api";
import { RoleName } from "@/types/roles";

export const checkIsAdmin = (token_user: TokenUser | undefined | null) =>
  token_user?.cohort_discovery_roles.includes(RoleName.ADMIN) || false;
