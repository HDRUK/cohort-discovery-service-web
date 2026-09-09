export const MAX_PLOTTED_COLLECTIONS = 8;

export const assignColourSlots = (
  previous: Record<string, number>,
  selected: string[],
  slots = MAX_PLOTTED_COLLECTIONS,
): Record<string, number> => {
  const wanted = [...new Set(selected)];

  const kept = wanted.filter(
    (pid) => previous[pid] !== undefined && previous[pid] < slots,
  );

  const taken = new Set(kept.map((pid) => previous[pid]));
  const free = Array.from({ length: slots }, (_, slot) => slot).filter(
    (slot) => !taken.has(slot),
  );

  const assignment: Record<string, number> = {};
  kept.forEach((pid) => {
    assignment[pid] = previous[pid];
  });

  wanted
    .filter((pid) => assignment[pid] === undefined)
    .forEach((pid) => {
      const slot = free.shift();
      if (slot !== undefined) assignment[pid] = slot;
    });

  return assignment;
};

export const plottablePids = (assignment: Record<string, number>): string[] =>
  Object.keys(assignment).sort((a, b) => assignment[a] - assignment[b]);

export const toSlotList = (
  assignment: Record<string, number>,
  slots = MAX_PLOTTED_COLLECTIONS,
): string[] => {
  const list = Array.from(
    { length: slots },
    (_, slot) =>
      Object.keys(assignment).find((pid) => assignment[pid] === slot) ?? "",
  );

  while (list.length && !list[list.length - 1]) list.pop();

  return list;
};

export const fromSlotList = (list: string[]): Record<string, number> =>
  Object.fromEntries(
    list.map((pid, slot) => [pid, slot] as const).filter(([pid]) => pid !== ""),
  );
