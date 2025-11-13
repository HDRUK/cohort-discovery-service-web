import { NextResponse } from "next/server";

export async function proxy() {
  const res = NextResponse.next();
  //if we want to use the time later on
  res.headers.set("x-request-now", String(Math.floor(Date.now() / 1000)));
  return res;
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
