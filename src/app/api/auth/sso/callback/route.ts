import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/sso/error?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/sso/error?error=invalid_callback", request.url),
    );
  }

  try {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:8100";
    const response = await fetch(`${apiBaseUrl}/api/auth/sso/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      return NextResponse.redirect(
        new URL("/auth/sso/error?error=exchange_failed", request.url),
      );
    }

    const data = (await response.json()) as { data?: { access_token?: string } };
    const token = data?.data?.access_token;

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/sso/error?error=exchange_failed", request.url),
      );
    }

    const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;
    if (!decoded) {
      return NextResponse.redirect(
        new URL("/auth/sso/error?error=exchange_failed", request.url),
      );
    }

    const exp = decoded.exp ? Math.floor(decoded.exp) : undefined;
    const now = Math.floor(Date.now() / 1000);
    const skew = 30;

    const maxAge = exp ? Math.max(0, exp - now - skew) : 60 * 60;

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("SSO callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/sso/error?error=exchange_failed", request.url),
    );
  }
}
