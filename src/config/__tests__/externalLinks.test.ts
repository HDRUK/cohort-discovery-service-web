import { externalLinks, getLegalLinks } from "../externalLinks";
import { routes } from "../routes";

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
