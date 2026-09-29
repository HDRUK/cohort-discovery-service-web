import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8100";

const ssoProviderFrom = (token: string | undefined): string | undefined => {
  if (!token) {
    return undefined;
  }

  const decoded = jwt.decode(token) as JwtPayload | null;
  return decoded?.user?.sso_provider;
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const ssoProvider = ssoProviderFrom(token);

  const base = REDIRECT_URL ?? req.url;
  const url = ssoProvider
    ? new URL(`/api/auth/sso/${ssoProvider}/logout`, API_BASE_URL)
    : new URL("/login", base);

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
