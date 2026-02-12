import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { TokenUser } from "@/types/api";
import { redirect } from "next/navigation";
import { isStandalone } from "@/utils/modes";

const applicationMode = process.env.APPLICATION_MODE;

export async function getTokenUser(): Promise<{
  user: TokenUser;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;

  const user = decoded?.user as TokenUser;
  if (!user) {
    if (isStandalone(applicationMode)) {
      redirect("/login");
    } else {
      redirect("/user-not-found");
    }
  }

  return { user };
}
