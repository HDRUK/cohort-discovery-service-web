import { externalLinks, getLegalLinks } from "../externalLinks";
import { routes } from "../routes";
import branding from "@branding/branding.config";

describe("externalLinks", () => {
  it("builds gateway urls without a doubled slash", () => {
    Object.values(externalLinks).forEach((href) =>
      expect(href).not.toMatch(/[^:]\/\//),
    );
  });
});

describe("getLegalLinks", () => {
  it("keeps standalone users inside the app", () => {
    expect(getLegalLinks(true)).toEqual({
      termsAndConditions: routes.termsAndConditions,
      privacyPolicy: routes.privacyPolicy,
    });
  });

  it("sends integrated users to the gateway", () => {
    const { termsAndConditions, privacyPolicy } = getLegalLinks(false);

    expect(termsAndConditions).toBe(externalLinks.termsAndConditions);
    expect(privacyPolicy).toBe(externalLinks.privacyPolicy);
    expect(termsAndConditions).toMatch(/^https?:\/\//);
  });
});

describe("getOrganisationUrl", () => {
  const loadResolver = async () => {
    const { getOrganisationUrl } = await import("../externalLinks");
    return getOrganisationUrl;
  };

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_LOGIN_URL;
    jest.resetModules();
  });

  it("falls back to the branded organisation url when unset", async () => {
    const getOrganisationUrl = await loadResolver();

    expect(getOrganisationUrl()).toBe(branding.links.organisation);
  });

  it("falls back when the env var is blank rather than returning an empty host", async () => {
    process.env.NEXT_PUBLIC_LOGIN_URL = "";
    const getOrganisationUrl = await loadResolver();

    expect(getOrganisationUrl()).toBe(branding.links.organisation);
  });

  it("strips trailing slashes so joined paths never double up", async () => {
    process.env.NEXT_PUBLIC_LOGIN_URL = "https://example.org///";
    const getOrganisationUrl = await loadResolver();

    expect(getOrganisationUrl()).toBe("https://example.org");
  });
});
