import { CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";

const checkIsAdmin = (user?: CombinedUser | null) =>
  !!user?.roles.find((r) => r.name === RoleName.ADMIN);

const checkHasNhsSdeAccess = (user?: CombinedUser | null) =>
  user?.workgroups?.some(
    (workgroup) => workgroup.name.trim().toUpperCase() === "NHS-SDE",
  ) ?? false;

const getLastName = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]; // last word
};

export { checkHasNhsSdeAccess, checkIsAdmin, getLastName };
