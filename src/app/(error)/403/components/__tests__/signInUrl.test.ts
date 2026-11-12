import { routes } from "@/config/routes";
import { getOrganisationUrl } from "@/config/externalLinks";
import { signInUrl } from "../signInUrl";

const GATEWAY_SIGN_IN =
  "https://gateway.example.org/en?redirect_cohort_discovery_upon_signin=https://cds.example.org";

describe("signInUrl", () => {
  it("keeps standalone users on the app's own sign-in page", () => {
    expect(signInUrl(true, GATEWAY_SIGN_IN)).toBe(routes.login);
  });

  it("sends integrated users to the full gateway sign-in url so they return afterwards", () => {
    expect(signInUrl(false, GATEWAY_SIGN_IN)).toBe(GATEWAY_SIGN_IN);
  });

  it("falls back to the organisation url when the sign-in url is unset", () => {
    expect(signInUrl(false, undefined)).toBe(getOrganisationUrl());
  });

  it("falls back to the organisation url when the sign-in url is blank", () => {
    expect(signInUrl(false, "")).toBe(getOrganisationUrl());
  });
});
