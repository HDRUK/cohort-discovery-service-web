import { routes } from "@/config/routes";

const gatewayBase = (
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org"
).replace(/\/+$/, "");

export const GATEWAY_URL = gatewayBase;

export const externalLinks = {
  hdrukSite: gatewayBase,
  termsAndConditions: `${gatewayBase}/terms-and-conditions`,
  privacyPolicy: `${gatewayBase}/about/privacy-policy`,
  cookieNotice: `${gatewayBase}/about/cookie-notice`,
  accessibilityStatement: `${gatewayBase}/about/accessibility-statement`,
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
