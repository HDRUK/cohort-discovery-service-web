import "server-only";

import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { routes } from "@/config/routes";
import { API_ROUTES, isPathSegment } from "@/lib/apiRoutes";
import { isStandalone } from "@/utils/modes";

interface CookieWriter {
  delete: (name: string) => unknown;
  set: (
    name: string,
    value: string,
    options: {
      expires: Date;
      maxAge: number;
      path: string;
      httpOnly: boolean;
      sameSite: "lax";
    },
  ) => unknown;
}

const ssoClaimsFrom = (
  token: string | undefined,
): { provider?: string; logoutTicket?: string } => {
  if (!token) {
    return {};
  }

  const decoded = jwt.decode(token) as JwtPayload | null;
  return {
    provider: decoded?.user?.sso_provider,
    logoutTicket: decoded?.user?.sso_logout_ticket,
  };
};

export const signedOutLocation = (token: string | undefined): string => {
  const { provider, logoutTicket } = ssoClaimsFrom(token);
  const gatewayUrl = process.env.NEXT_PUBLIC_LOGIN_URL;

  if (provider && isPathSegment(provider)) {
    const ssoLogoutUrl = new URL(
      API_ROUTES.ssoLogout(provider),
      process.env.API_BASE_URL,
    );
    if (logoutTicket) {
      ssoLogoutUrl.searchParams.set("ticket", logoutTicket);
    }
    return ssoLogoutUrl.toString();
  }

  if (isStandalone(process.env.APPLICATION_MODE) || !gatewayUrl) {
    return routes.login;
  }

  return gatewayUrl;
};

export const clearAccessTokenCookie = (cookieWriter: CookieWriter): void => {
  cookieWriter.delete(ACCESS_TOKEN_NAME);
  cookieWriter.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
};
