import { getContent } from "./custom403Content";

const ORGANISATION_URL = "https://gateway.example.org";
const SIGN_IN_URL =
  "https://gateway.example.org/sign-in?redirect_cohort_discovery_upon_signin=https://cds.example.org";

describe("getContent", () => {
  it("explains a missing role and returns to the dashboard", () => {
    const { messages, redirectUrl } = getContent(
      "missing-role",
      true,
      ORGANISATION_URL,
      "/login",
    );

    expect(messages[0]).toBe(
      "You do not have the required role to access this page.",
    );
    expect(redirectUrl).toBe("/dashboard");
  });

  it("sends a user without a token to the sign-in url", () => {
    expect(
      getContent("no-token", false, ORGANISATION_URL, SIGN_IN_URL).redirectUrl,
    ).toBe(SIGN_IN_URL);
  });

  it("sends an integrated user with an unknown reason to the organisation", () => {
    expect(
      getContent(null, false, ORGANISATION_URL, SIGN_IN_URL).redirectUrl,
    ).toBe(ORGANISATION_URL);
  });

  it("falls back to the generic message for an unknown reason", () => {
    const { messages, redirectUrl } = getContent(
      null,
      true,
      ORGANISATION_URL,
      "/login",
    );

    expect(messages[0]).toBe(
      "You do not have the correct permissions to access something on this page.",
    );
    expect(redirectUrl).toBe("/");
  });
});
