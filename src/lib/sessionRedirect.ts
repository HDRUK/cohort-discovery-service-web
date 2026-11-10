import { routes } from "@/config/routes";

const NO_TOKEN_FORBIDDEN_PATH = "/403?reason=no-token";

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
