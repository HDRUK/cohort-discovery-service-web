import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { routes } from "@/config/routes";
import { redirectTo } from "@/lib/redirect";
import { isStandalone } from "@/utils/modes";

const API_BASE_URL = process.env.API_BASE_URL;
const GATEWAY_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const CDS_PUBLIC_URL = process.env.CDS_PUBLIC_URL;
// Gateway sets the token cookie on its parent domain (e.g.
// .healthdatagateway.org), so it can only be cleared by naming that domain.
const COOKIE_TOKEN_DOMAIN = process.env.COOKIE_TOKEN_DOMAIN;
const applicationMode = process.env.APPLICATION_MODE;

// Gateway has no /login page; its home page hosts sign-in and its
// CohortRedirectProvider reads this param to send approved users back to CDS.
const GATEWAY_SIGN_IN_PATH = "/en";
const GATEWAY_RETURN_PARAM = "redirect_cohort_discovery_upon_signin";

const gatewaySignInUrl = (gatewayUrl: string): string => {
  const url = new URL(GATEWAY_SIGN_IN_PATH, gatewayUrl);
  if (CDS_PUBLIC_URL) {
    url.searchParams.set(GATEWAY_RETURN_PARAM, CDS_PUBLIC_URL);
  }
  return url.toString();
};

const ssoClaimsFrom = (
  token: string | undefined,
): { provider?: string; logoutTicket?: string } => {
  if (!token) {
    return {};
  }

  const decoded = jwt.decode(token) as JwtPayload | null;
  return {
    provider: decoded?.user?.sso_provider,
    logoutTicket: decoded?.user?.sso_logout_ticket,
  };
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const { provider: ssoProvider, logoutTicket } = ssoClaimsFrom(token);

  let location: string;

  if (ssoProvider) {
    const ssoLogoutUrl = new URL(
      `/api/auth/sso/${encodeURIComponent(ssoProvider)}/logout`,
      API_BASE_URL,
    );
    if (logoutTicket) {
      ssoLogoutUrl.searchParams.set("ticket", logoutTicket);
    }
    location = ssoLogoutUrl.toString();
  } else if (isStandalone(applicationMode) || !GATEWAY_URL) {
    location = routes.login;
  } else {
    location = gatewaySignInUrl(GATEWAY_URL);
  }

  const response = redirectTo(location);
  // Delete via multiple strategies to handle domain-scoped cookies set by
  // different origins (e.g., Cypress test runner sets domain: "localhost").
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.set(ACCESS_TOKEN_NAME, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  // Appended separately: cookies.set would overwrite the host-only delete
  // above, as both share the same name.
  if (COOKIE_TOKEN_DOMAIN) {
    response.headers.append(
      "Set-Cookie",
      `${ACCESS_TOKEN_NAME}=; Domain=${COOKIE_TOKEN_DOMAIN}; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    );
  }
  return response;
}
