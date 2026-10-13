import { cookies, headers } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const CLOCK_SKEW_SECONDS = 30;
const FALLBACK_MAX_AGE_SECONDS = 60 * 60;

export const getAccessTokenMaxAge = (
  exp: number | undefined,
  nowInSeconds: number,
): number =>
  exp
    ? Math.max(0, exp - nowInSeconds - CLOCK_SKEW_SECONDS)
    : FALLBACK_MAX_AGE_SECONDS;

const getRequestNowInSeconds = async (): Promise<number> => {
  const requestNow = Number((await headers()).get("x-request-now"));

  return Number.isFinite(requestNow) && requestNow > 0
    ? Math.floor(requestNow)
    : Math.floor(Date.now() / 1000);
};

export const setAccessTokenCookie = async (
  token: string,
): Promise<boolean> => {
  const decoded = token ? (jwt.decode(token) as JwtPayload | null) : null;

  if (!decoded) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAccessTokenMaxAge(decoded.exp, await getRequestNowInSeconds()),
  });

  return true;
};
