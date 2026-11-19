import { NextRequest } from "next/server";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { redirectTo } from "@/lib/redirect";
import { clearAccessTokenCookie, signedOutLocation } from "@/server/logout";

const CLEAR_BROWSER_STORAGE = '"storage"';

export async function GET(req: NextRequest) {
  const response = redirectTo(
    signedOutLocation(req.cookies.get(ACCESS_TOKEN_NAME)?.value),
  );
  clearAccessTokenCookie(response.cookies);
  response.headers.set("Clear-Site-Data", CLEAR_BROWSER_STORAGE);
  return response;
}
