import { NextRequest, NextResponse } from "next/server";
import ssoExchange from "@/actions/standalone/ssoExchange";
import { routes } from "@/config/routes";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const idpError = searchParams.get("error");

  const redirectToError = (error: string) =>
    NextResponse.redirect(new URL(routes.ssoError(error), request.url));

  if (idpError) {
    return redirectToError(idpError);
  }

  if (!code) {
    return redirectToError("invalid_callback");
  }

  try {
    const exchanged = await ssoExchange(code);

    return exchanged
      ? NextResponse.redirect(new URL(routes.home, request.url))
      : redirectToError("exchange_failed");
  } catch (error) {
    console.error("SSO callback error:", error);
    return redirectToError("exchange_failed");
  }
}
