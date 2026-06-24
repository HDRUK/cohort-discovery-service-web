import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { isOidcEnabled } from "@/lib/oidc";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const signOutUrl = new URL("/auth/signout", origin);
  signOutUrl.searchParams.set("callbackUrl", `${origin}/login`);

  const base = REDIRECT_URL ?? req.url;
  const loginUrl = new URL("/login", base);

  const response = NextResponse.redirect(
    isOidcEnabled() ? signOutUrl : loginUrl,
  );
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
