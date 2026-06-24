import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { isOidcEnabled, getOidcEndSessionEndpoint } from "@/lib/oidc";

export async function GET(req: NextRequest) {
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL ?? `${req.nextUrl.origin}/login`;

  const endSessionEndpoint = isOidcEnabled() ? await getOidcEndSessionEndpoint() : null;

  let token = null;
  if (endSessionEndpoint) {
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch {
      token = null;
    }
  }

  const endSessionUrl = new URL(endSessionEndpoint ?? loginUrl);
  if (endSessionEndpoint) {
    endSessionUrl.searchParams.set("post_logout_redirect_uri", loginUrl);
    if (token?.idToken) {
      endSessionUrl.searchParams.set("id_token_hint", token.idToken);
    }
  }

  const response = NextResponse.redirect(endSessionUrl.toString());

  const sessionCookieAttributes = {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
  };

  response.cookies.set("next-auth.session-token", "", sessionCookieAttributes);
  response.cookies.set(
    "__Secure-next-auth.session-token",
    "",
    { ...sessionCookieAttributes, secure: true },
  );
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0), maxAge: 0, path: "/", httpOnly: true, sameSite: "lax",
  });

  return response;
}
