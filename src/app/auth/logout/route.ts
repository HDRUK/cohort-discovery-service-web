import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { isOidcEnabled, getOidcEndSessionEndpoint } from "@/lib/oidc";

export async function GET(req: NextRequest) {
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL ?? `${req.nextUrl.origin}/login`;

  const endSessionEndpoint = isOidcEnabled() ? await getOidcEndSessionEndpoint() : null;

  const response = NextResponse.redirect(
    endSessionEndpoint
      ? `${endSessionEndpoint}?post_logout_redirect_uri=${encodeURIComponent(loginUrl)}`
      : loginUrl,
  );

  response.cookies.set("next-auth.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0), maxAge: 0, path: "/", httpOnly: true, sameSite: "lax",
  });

  return response;
}
