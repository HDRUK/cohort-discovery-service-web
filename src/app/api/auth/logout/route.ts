import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const REDIRECT_URL = process?.env?.NEXT_PUBLIC_LOGIN_URL;

export async function GET(req: NextRequest) {
  const base = REDIRECT_URL ?? req.url;
  const url = new URL("/login", base);

  const response = NextResponse.redirect(url);
  // Delete via multiple strategies to handle domain-scoped cookies set by
  // different origins (e.g., Cypress test runner sets domain: "localhost").
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
