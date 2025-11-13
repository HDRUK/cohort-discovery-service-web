import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  const PUBLIC_PATHS = ["/", "/login", "/signup", "/about"];
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const token = await getToken({ req });
  console.log("found token", token);
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const exp = typeof token.exp === "number" ? token.exp : undefined;
  if (exp && Math.floor(Date.now() / 1000) >= exp) {
    return NextResponse.redirect(new URL("/api/auth/logout", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("x-request-now", String(Math.floor(Date.now() / 1000)));
  return res;
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*"],
};
