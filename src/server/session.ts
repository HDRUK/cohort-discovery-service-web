import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { routes } from "@/config/routes";
import { isSessionExpired, signedOutRedirect } from "@/lib/sessionRedirect";
import { TokenUser } from "@/types/api";
import { isStandalone } from "@/utils/modes";

export interface Session {
  token: string;
  user: TokenUser;
  exp?: number;
}

export const decodeSession = (token: string | undefined): Session | null => {
  if (!token) return null;

  const decoded = jwt.decode(token) as JwtPayload | null;
  const user = decoded?.user as TokenUser | undefined;
  if (!user) return null;

  return { token, user, exp: decoded?.exp };
};

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(ACCESS_TOKEN_NAME)?.value);
};

export const requireSession = async (): Promise<Session> => {
  const [session, requestHeaders] = await Promise.all([
    getSession(),
    headers(),
  ]);
  if (!session) {
    redirect(
      signedOutRedirect(
        isStandalone(process.env.APPLICATION_MODE),
        requestHeaders.get("x-pathname"),
      ),
    );
  }
  if (
    isSessionExpired(session.exp, Number(requestHeaders.get("x-request-now")))
  ) {
    redirect(routes.logout);
  }
  return session;
};

export const hasLiveSession = async (): Promise<boolean> => {
  const [session, requestHeaders] = await Promise.all([
    getSession(),
    headers(),
  ]);
  return (
    !!session &&
    !isSessionExpired(session.exp, Number(requestHeaders.get("x-request-now")))
  );
};
