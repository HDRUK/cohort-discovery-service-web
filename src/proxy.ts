import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  //if we want to use the time later on
  headers.set("x-request-now", String(Math.floor(Date.now() / 1000)));
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
