import { NextResponse } from "next/server";
import { API_ROUTES, GATEWAY_ROUTES } from "@/lib/apiRoutes";

export async function GET() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: "9fafa032-494f-4e95-90a3-74854b87c114",
    redirect_uri: API_ROUTES.authCallback,
    //redirect_uri: "/api/auth/callback",
    scope: "openid email profile rquestroles",
  });

  const authorizeUrl = `${GATEWAY_ROUTES.api.oauth2}?${params.toString()}`;

  const res = await fetch(authorizeUrl);

  return NextResponse.redirect("http://localhost:3000");
}
