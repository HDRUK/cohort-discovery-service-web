import { User } from "@/types/api";

export interface UserFilters {
  workgroupId?: string | null;
  searchTerm?: string;
}

// may have been better for this to be BE logic
// - we dont have a workgroup user filter on the BE now, so this will do
// - noted for future improvement
export const filterUsers = (
  users: User[],
  { workgroupId, searchTerm }: UserFilters,
): User[] => {
  const term = (searchTerm ?? "").toLowerCase().trim();

  return users.filter((user) => {
    const inWorkgroup =
      !workgroupId ||
      !!user.workgroups?.some((wg) => String(wg.id) === String(workgroupId));

    const matchesTerm =
      !term ||
      (user.name ?? "").toLowerCase().includes(term) ||
      (user.email ?? "").toLowerCase().includes(term);

    return inWorkgroup && matchesTerm;
  });
};
