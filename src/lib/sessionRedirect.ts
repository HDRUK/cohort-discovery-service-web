import { routes } from "@/config/routes";

export const SESSION_CLOCK_SKEW_SECONDS = 30;

const NO_TOKEN_FORBIDDEN_PATH = `${routes.forbidden}?reason=no-token`;

export const signedOutRedirect = (
  standalone: boolean,
  requestedPath: string | null,
): string => {
  if (!standalone) return NO_TOKEN_FORBIDDEN_PATH;
  return requestedPath && requestedPath !== routes.home
    ? routes.loginWithReturn(requestedPath)
    : routes.login;
};

export const isSessionExpired = (
  exp: number | undefined,
  nowSeconds: number,
): boolean => !!exp && nowSeconds > 0 && nowSeconds >= exp;

export const msUntilSessionEnds = (
  exp: number | undefined,
  nowMs: number,
): number | null =>
  exp ? Math.max(0, (exp - SESSION_CLOCK_SKEW_SECONDS) * 1000 - nowMs) : null;
