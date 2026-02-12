import { CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";

const checkIsAdmin = (user?: CombinedUser | null) =>
  !!user?.roles.find((r) => r.name === RoleName.ADMIN);

export { checkIsAdmin };
