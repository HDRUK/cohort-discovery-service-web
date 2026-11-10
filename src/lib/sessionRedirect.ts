import jwt, { JwtPayload } from "jsonwebtoken";
import { routes } from "@/config/routes";

const PUBLIC_PATHS = [
  "/login",
  "/auth/sso",
  "/about",
  "/terms-and-conditions",
  "/403",
  "/user-not-found",
];

const NO_TOKEN_FORBIDDEN_PATH = "/403?reason=no-token";

export interface SessionRedirectArgs {
  token: string | undefined;
  nowSeconds: number;
  pathname: string;
  search: string;
  standalone: boolean;
}

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

const decode = (token: string | undefined): JwtPayload | null =>
  token ? (jwt.decode(token) as JwtPayload | null) : null;

export const sessionRedirect = ({
  token,
  nowSeconds,
  pathname,
  search,
  standalone,
}: SessionRedirectArgs): string | null => {
  if (isPublicPath(pathname)) return null;

  const decoded = decode(token);

  if (!decoded) {
    if (!standalone) return NO_TOKEN_FORBIDDEN_PATH;
    return pathname === routes.home
      ? routes.login
      : routes.loginWithReturn(`${pathname}${search}`);
  }

  if (decoded.exp && nowSeconds >= decoded.exp) return routes.logout;

  return null;
};
