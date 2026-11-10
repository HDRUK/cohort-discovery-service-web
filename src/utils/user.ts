import { Collection, CombinedUser, User } from "@/types/api";
import { RoleName } from "@/types/roles";
import { WorkgroupNames } from "@/config/workgroups";

const checkIsAdmin = (user?: Pick<User, "roles"> | null) =>
  !!user?.roles.find((r) => r.name === RoleName.ADMIN);

const checkHasNhsSdeAccess = (user?: CombinedUser | null) =>
  user?.workgroups?.some(
    (workgroup) => workgroup.name.trim().toUpperCase() === "NHS-SDE",
  ) ?? false;

const isOnlyInDefaultWorkgroup = (user?: CombinedUser | null): boolean =>
  (user?.workgroups?.length ?? 0) === 1 &&
  user?.workgroups?.[0]?.name === WorkgroupNames.DEFAULT;

const isQuotaExhausted = (user?: CombinedUser | null): boolean =>
  !!user?.query_quota &&
  !user.query_quota.unlimited &&
  (user.query_quota.remaining ?? 0) <= 0;

const hasSyntheticSelection = (
  selectedPids: string[],
  collections: Collection[],
): boolean => {
  const selected = new Set(selectedPids);
  return collections.some(
    (collection) => collection.is_synthetic && selected.has(collection.pid),
  );
};

const isCustodianMember = (
  user: Pick<User, "custodians"> | null | undefined,
  custodianPid: string,
): boolean =>
  !!user?.custodians?.some((custodian) => custodian.pid === custodianPid);

const getLastName = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]; // last word
};

export {
  checkHasNhsSdeAccess,
  checkIsAdmin,
  getLastName,
  hasSyntheticSelection,
  isCustodianMember,
  isOnlyInDefaultWorkgroup,
  isQuotaExhausted,
};
