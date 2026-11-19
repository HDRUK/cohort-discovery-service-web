import { RoleName } from "@/types/roles";
import { Custodian } from "@/types/api";
import { useSessionData } from "@/contexts/SessionDataContext";

const usePermissions = () => {
  const user = useSessionData().user;
  const isAdmin = user?.roles.map((r) => r.name).includes(RoleName.ADMIN);

  const isCustodianAdmin = (custodian: Custodian) =>
    user?.custodians.map((c) => c.pid).includes(custodian.pid);

  return { isAdmin, isCustodianAdmin };
};

export default usePermissions;
