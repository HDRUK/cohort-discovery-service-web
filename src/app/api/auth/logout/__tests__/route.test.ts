/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_NAME } from "@/config/internals";

const LOGOUT_URL = "https://localhost:3000/api/auth/logout";
const GATEWAY = "https://web.dev.hdruk.cloud";
const API = "https://api.cohort-discovery.dev.hdruk.cloud";

const signSsoToken = (provider: string, logoutTicket?: string) =>
  jwt.sign({ user: { sso_provider: provider, sso_logout_ticket: logoutTicket } }, "test-secret");

const requestWith = (token?: string) =>
  new NextRequest(LOGOUT_URL, {
    headers: token ? { cookie: `${ACCESS_TOKEN_NAME}=${token}` } : {},
  });

const logoutWith = async (
  env: { mode?: string; gatewayUrl?: string },
  token?: string,
) => {
  if (env.mode === undefined) {
    delete process.env.APPLICATION_MODE;
  } else {
    process.env.APPLICATION_MODE = env.mode;
  }

  if (env.gatewayUrl === undefined) {
    delete process.env.NEXT_PUBLIC_LOGIN_URL;
  } else {
    process.env.NEXT_PUBLIC_LOGIN_URL = env.gatewayUrl;
  }

  process.env.API_BASE_URL = API;

  const { GET } = await import("../route");
  return GET(requestWith(token));
};

describe("GET /api/auth/logout", () => {
  afterEach(() => {
    delete process.env.APPLICATION_MODE;
    delete process.env.NEXT_PUBLIC_LOGIN_URL;
    delete process.env.API_BASE_URL;
    jest.resetModules();
  });

  it("redirects to a same-origin relative path in standalone mode", async () => {
    const response = await logoutWith({ mode: "standalone", gatewayUrl: GATEWAY });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("/login");
  });

  it("ignores the request host so a mangled Host header cannot change the destination", async () => {
    const response = await logoutWith({ mode: "standalone" });

    expect(response.headers.get("location")).not.toContain("localhost:3000");
    expect(response.headers.get("location")).toBe("/login");
  });

  it("redirects to the gateway login page in integrated mode", async () => {
    const response = await logoutWith({ mode: "integrated", gatewayUrl: GATEWAY });

    expect(response.headers.get("location")).toBe(`${GATEWAY}/login`);
  });

  it("falls back to a relative path when the gateway url is unset", async () => {
    const response = await logoutWith({ mode: "integrated" });

    expect(response.headers.get("location")).toBe("/login");
  });

  it("falls back to a relative path when the gateway url is blank rather than throwing", async () => {
    const response = await logoutWith({ mode: "integrated", gatewayUrl: "" });

    expect(response.headers.get("location")).toBe("/login");
  });

  it("redirects to the api sso logout endpoint when the token names a provider", async () => {
    const response = await logoutWith(
      { mode: "standalone" },
      signSsoToken("keycloak", "ticket-123"),
    );

    const location = new URL(response.headers.get("location") as string);
    expect(location.origin).toBe(API);
    expect(location.pathname).toBe("/api/auth/sso/keycloak/logout");
    expect(location.searchParams.get("ticket")).toBe("ticket-123");
  });

  it("omits the ticket param when the token carries no logout ticket", async () => {
    const response = await logoutWith(
      { mode: "standalone" },
      signSsoToken("keycloak"),
    );

    const location = new URL(response.headers.get("location") as string);
    expect(location.searchParams.has("ticket")).toBe(false);
  });

  it("expires the access token cookie", async () => {
    const response = await logoutWith({ mode: "standalone" });

    const setCookie = response.headers.getSetCookie().join("; ");
    expect(setCookie).toContain(`${ACCESS_TOKEN_NAME}=;`);
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("HttpOnly");
  });
});
