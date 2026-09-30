import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8100";

const ssoClaimsFrom = (
  token: string | undefined
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

  let url: URL;

  if (ssoProvider) {
    url = new URL(`/api/auth/sso/${ssoProvider}/logout`, API_BASE_URL);
    // Without the ticket the IdP cannot identify the session and asks the
    // user to confirm instead of logging them out.
    if (logoutTicket) {
      url.searchParams.set("ticket", logoutTicket);
    }
  } else {
    url = new URL("/login", req.url);
  }

  const response = NextResponse.redirect(url);
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
