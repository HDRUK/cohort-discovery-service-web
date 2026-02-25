import { RoleName } from "@/types/roles";
import useUserStore from "./useUserStore";
import { Custodian } from "@/types/api";

const usePermissions = () => {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.roles.map((r) => r.name).includes(RoleName.ADMIN);

  const isCustodianAdmin = (custodian: Custodian) =>
    user?.custodians.map((c) => c.pid).includes(custodian.pid);

  return { isAdmin, isCustodianAdmin };
};

export default usePermissions;
