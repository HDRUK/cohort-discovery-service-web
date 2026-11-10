import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { sessionRedirect } from "@/lib/sessionRedirect";
import { isStandalone } from "@/utils/modes";

export async function proxy(request: NextRequest) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const redirectPath = sessionRedirect({
    token: request.cookies.get(ACCESS_TOKEN_NAME)?.value,
    nowSeconds,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    standalone: isStandalone(process.env.APPLICATION_MODE),
  });
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.nextUrl));
  }

  const headers = new Headers(request.headers);
  //if we want to use the time later on
  headers.set("x-request-now", String(nowSeconds));
  headers.set(
    "x-pathname",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
