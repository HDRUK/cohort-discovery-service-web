import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { TokenUser } from "@/types/api";
import { redirect } from "next/navigation";
import { isStandalone } from "@/utils/modes";
import { routes } from "@/config/routes";

const applicationMode = process.env.APPLICATION_MODE;

function redirectToSignIn(): never {
  redirect(isStandalone(applicationMode) ? routes.login : "/user-not-found");
}

export function requireSession(
  token: string | undefined,
): asserts token is string {
  if (!token) redirectToSignIn();
}

export async function getTokenUser(): Promise<{
  user: TokenUser;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;

  const user = decoded?.user as TokenUser;
  if (!user) redirectToSignIn();

  return { user };
}
