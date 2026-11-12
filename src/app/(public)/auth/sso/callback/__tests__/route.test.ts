/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "../route";

const callbackWith = (search: string) =>
  GET(new NextRequest(`https://localhost/auth/sso/callback${search}`));

describe("GET /auth/sso/callback", () => {
  it("forwards the code to the api callback", async () => {
    const response = await callbackWith("?code=abc&state=ignored");

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "/api/auth/sso/callback?code=abc",
    );
  });

  it("forwards an identity provider error", async () => {
    const response = await callbackWith("?error=idp_error");

    expect(response.headers.get("location")).toBe(
      "/api/auth/sso/callback?error=idp_error",
    );
  });
});
