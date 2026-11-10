export const selectById = <T extends { id: number }>(
  items: T[],
  id: string | null,
): T | null => items.find((item) => String(item.id) === id) ?? null;

export const selectByIdOrFirst = <T extends { id: number }>(
  items: T[],
  id: string | null,
): T | null => selectById(items, id) ?? items[0] ?? null;

export const selectAllById = <T extends { id: number }>(
  items: T[],
  ids: string[],
): T[] =>
  ids
    .map((id) => selectById(items, id))
    .filter((item): item is T => item !== null);
