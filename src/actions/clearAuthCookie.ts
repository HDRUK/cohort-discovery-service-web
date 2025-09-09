"use server";

import { cookies } from "next/headers";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(GATEWAY_TOKEN_NAME, "", {
    expires: new Date(0),
    path: "/",
  });
}
