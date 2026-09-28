"use server";

import { cookies, headers } from "next/headers";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import jwt, { JwtPayload } from "jsonwebtoken";

export const setAuthCookie = async (token: string): Promise<boolean> => {
  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;
  if (!decoded) {
    return false;
  }

  const exp = decoded.exp ? Math.floor(decoded.exp) : undefined;

  const h = await headers();
  const requestNow = h?.get("x-request-now");
  const now = requestNow !== null ? Math.floor(Number(requestNow)) : 0;
  const skew = 30;

  const maxAge = exp ? Math.max(0, exp - now - skew) : 60 * 60;

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return true;
};
