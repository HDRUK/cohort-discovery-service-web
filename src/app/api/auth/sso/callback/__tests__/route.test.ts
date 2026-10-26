/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../route";
import ssoExchange from "@/actions/standalone/ssoExchange";

jest.mock("@/actions/standalone/ssoExchange", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedSsoExchange = ssoExchange as jest.MockedFunction<
  typeof ssoExchange
>;

const PROXIED_HOST = "https://localhost:3000";

const callbackWith = (params: Record<string, string>) =>
  GET(
    new NextRequest(
      `${PROXIED_HOST}/api/auth/sso/callback?${new URLSearchParams(params)}`,
    ),
  );

describe("GET /api/auth/sso/callback", () => {
  beforeEach(() => {
    mockedSsoExchange.mockReset();
  });

  it("redirects to a same-origin relative path after a successful exchange", async () => {
    mockedSsoExchange.mockResolvedValue(true);

    const response = await callbackWith({ code: "auth-code" });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("/");
  });

  it("ignores the request host so a mangled Host header cannot change the destination", async () => {
    mockedSsoExchange.mockResolvedValue(true);

    const response = await callbackWith({ code: "auth-code" });

    expect(response.headers.get("location")).not.toContain("localhost:3000");
  });

  it("redirects to the error page when the identity provider reports an error", async () => {
    const response = await callbackWith({ error: "access_denied" });

    expect(response.headers.get("location")).toBe(
      "/auth/sso/error?error=access_denied",
    );
    expect(mockedSsoExchange).not.toHaveBeenCalled();
  });

  it("encodes an identity provider error so it cannot escape the error path", async () => {
    const response = await callbackWith({ error: "//evil.example.com" });

    expect(response.headers.get("location")).toBe(
      "/auth/sso/error?error=%2F%2Fevil.example.com",
    );
  });

  it("redirects to the error page when no code is present", async () => {
    const response = await callbackWith({});

    expect(response.headers.get("location")).toBe(
      "/auth/sso/error?error=invalid_callback",
    );
  });

  it("redirects to the error page when the exchange fails", async () => {
    mockedSsoExchange.mockResolvedValue(false);

    const response = await callbackWith({ code: "auth-code" });

    expect(response.headers.get("location")).toBe(
      "/auth/sso/error?error=exchange_failed",
    );
  });

  it("redirects to the error page when the exchange throws", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockedSsoExchange.mockRejectedValue(new Error("network down"));

    const response = await callbackWith({ code: "auth-code" });

    expect(response.headers.get("location")).toBe(
      "/auth/sso/error?error=exchange_failed",
    );
  });
});
