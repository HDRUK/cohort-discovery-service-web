export const shouldResetPreferences = (
  ownerId: number | null,
  userId: number,
): boolean => ownerId !== userId;
