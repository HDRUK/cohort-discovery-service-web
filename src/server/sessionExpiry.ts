import "server-only";

export const SESSION_CLOCK_SKEW_SECONDS = 30;

export const msUntilSessionEnds = (
  exp: number | undefined,
  requestNowSeconds: number,
): number | null =>
  exp && requestNowSeconds > 0
    ? Math.max(0, (exp - SESSION_CLOCK_SKEW_SECONDS - requestNowSeconds) * 1000)
    : null;
