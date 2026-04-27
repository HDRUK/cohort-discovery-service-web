import { CombinedUser } from "@/types/api";
import { RoleName } from "@/types/roles";

const checkIsAdmin = (user?: CombinedUser | null) =>
  !!user?.roles.find((r) => r.name === RoleName.ADMIN);

const getLastName = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]; // last word
};

export { checkIsAdmin, getLastName };
