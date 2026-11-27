export const diffMembership = (
  memberIds: number[],
  selectedIds: number[],
): { added: number[]; removed: number[] } => ({
  added: selectedIds.filter((id) => !memberIds.includes(id)),
  removed: memberIds.filter((id) => !selectedIds.includes(id)),
});
