import branding from "@branding/branding.config";
import { routes } from "@/config/routes";

const stripTrailingSlashes = (url: string) => url.replace(/\/+$/, "");

export const getOrganisationUrl = (): string =>
  stripTrailingSlashes(
    process.env.NEXT_PUBLIC_LOGIN_URL || branding.links.organisation,
  );

const organisationUrl = getOrganisationUrl();

export const GATEWAY_URL = organisationUrl;

export const externalLinks = {
  hdrukSite: organisationUrl,
  termsAndConditions: `${organisationUrl}/terms-and-conditions`,
  privacyPolicy: `${organisationUrl}/about/privacy-policy`,
  cookieNotice:
    branding.links.cookieNotice ?? `${organisationUrl}/about/cookie-notice`,
  accessibilityStatement:
    branding.links.accessibilityStatement ??
    `${organisationUrl}/about/accessibility-statement`,
};

export interface LegalLinks {
  termsAndConditions: string;
  privacyPolicy: string;
}

export const getLegalLinks = (isStandalone: boolean): LegalLinks =>
  isStandalone
    ? {
        termsAndConditions: routes.termsAndConditions,
        privacyPolicy: routes.privacyPolicy,
      }
    : {
        termsAndConditions: externalLinks.termsAndConditions,
        privacyPolicy: externalLinks.privacyPolicy,
      };
