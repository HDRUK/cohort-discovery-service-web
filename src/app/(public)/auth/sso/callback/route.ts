import { NextRequest } from "next/server";
import { routes } from "@/config/routes";
import { redirectTo } from "@/lib/redirect";

const FORWARDED_PARAMS = ["code", "error"];

export async function GET(request: NextRequest) {
  const params = new URLSearchParams();
  FORWARDED_PARAMS.forEach((name) => {
    const value = request.nextUrl.searchParams.get(name);
    if (value) params.append(name, value);
  });

  return redirectTo(`${routes.ssoCallback}?${params.toString()}`);
}
