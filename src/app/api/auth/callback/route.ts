import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = req.cookies.get("oauth_state")?.value;
  const codeVerifier = req.cookies.get("pkce_verifier")?.value;

  if (!code || !state || !savedState || state !== savedState || !codeVerifier) {
    return new NextResponse("Invalid OAuth state or missing PKCE", {
      status: 400,
    });
  }

  const tokenRes = await fetch("http://localhost:8000/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "9fafa032-494f-4e95-90a3-74854b87c114",
      code,
      redirect_uri: "http://localhost:8100/auth/callback",
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return new NextResponse(`Token exchange failed: ${err}`, { status: 500 });
  }

  const tokens = await tokenRes.json(); // { access_token, id_token, refresh_token, ... }

  // Store tokens (cookie/session)
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("gateway_token", tokens.access_token, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });
  // clear transient cookies
  res.cookies.delete("oauth_state");
  res.cookies.delete("pkce_verifier");
  return res;
}
