import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { routes } from "@/config/routes";
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
  const session = await getSession();
  if (!session) {
    redirect(
      isStandalone(process.env.APPLICATION_MODE)
        ? routes.login
        : "/user-not-found",
    );
  }
  return session;
};
