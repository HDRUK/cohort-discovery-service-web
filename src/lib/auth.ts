import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { TokenUser } from "@/types/api";

export async function getTokenUser(): Promise<{
  user: TokenUser;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  const decoded = token ? (jwt.decode(token) as JwtPayload) : undefined;

  const user = decoded!.user as TokenUser;

  return { user };
}
