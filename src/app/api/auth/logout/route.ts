import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { routes } from "@/config/routes";
import { isStandalone } from "@/utils/modes";

const API_BASE_URL = process.env.API_BASE_URL;
const GATEWAY_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const applicationMode = process.env.APPLICATION_MODE;

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

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const { provider: ssoProvider, logoutTicket } = ssoClaimsFrom(token);

  let location: string;

  if (ssoProvider) {
    const ssoLogoutUrl = new URL(
      `/api/auth/sso/${encodeURIComponent(ssoProvider)}/logout`,
      API_BASE_URL,
    );
    if (logoutTicket) {
      ssoLogoutUrl.searchParams.set("ticket", logoutTicket);
    }
    location = ssoLogoutUrl.toString();
  } else if (isStandalone(applicationMode) || !GATEWAY_URL) {
    location = routes.login;
  } else {
    location = new URL(routes.login, GATEWAY_URL).toString();
  }

  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: location },
  });
  // Delete via multiple strategies to handle domain-scoped cookies set by
  // different origins (e.g., Cypress test runner sets domain: "localhost").
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
