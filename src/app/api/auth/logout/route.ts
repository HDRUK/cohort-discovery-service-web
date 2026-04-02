import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

export async function GET(req: NextRequest) {
  const url = new URL("/login", req.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
