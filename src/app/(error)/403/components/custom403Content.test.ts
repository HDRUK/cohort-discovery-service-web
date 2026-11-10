import { getContent } from "./custom403Content";

const ORGANISATION_URL = "https://gateway.example.org";

describe("getContent", () => {
  it("explains a missing role and returns to the dashboard", () => {
    const { messages, redirectUrl } = getContent(
      "missing-role",
      true,
      ORGANISATION_URL,
    );

    expect(messages[0]).toBe(
      "You do not have the required role to access this page.",
    );
    expect(redirectUrl).toBe("/dashboard");
  });

  it("sends a standalone user without a token to login", () => {
    expect(getContent("no-token", true, ORGANISATION_URL).redirectUrl).toBe(
      "/login",
    );
  });

  it("sends an integrated user without a token to the organisation", () => {
    expect(getContent("no-token", false, ORGANISATION_URL).redirectUrl).toBe(
      ORGANISATION_URL,
    );
  });

  it("falls back to the generic message for an unknown reason", () => {
    const { messages, redirectUrl } = getContent(null, true, ORGANISATION_URL);

    expect(messages[0]).toBe(
      "You do not have the correct permissions to access something on this page.",
    );
    expect(redirectUrl).toBe("/");
  });
});
