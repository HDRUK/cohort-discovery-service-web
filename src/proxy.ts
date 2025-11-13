import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const PUBLIC_PATHS = ["/", "/login", "/signup", "/about"];
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = req.cookies.get(GATEWAY_TOKEN_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = jwt.decode(token);
  const exp = typeof decoded.exp === "number" ? decoded.exp : undefined;

  if (exp && Math.floor(Date.now() / 1000) >= exp) {
    return NextResponse.redirect(new URL("/api/auth/logout", req.url));
  }

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
