import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  cookieStore.set(GATEWAY_TOKEN_NAME, "", {
    expires: new Date(0),
    path: "/",
  });

  const url = new URL("/login", req.url);
  return NextResponse.redirect(url);
}
