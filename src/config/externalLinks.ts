export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://www.hdruk.ac.uk/";

export const externalLinks = {
  hdrukSite: GATEWAY_URL,
  termsAndConditions: `${GATEWAY_URL}/terms-and-conditions`,
  privacyPolicy: `${GATEWAY_URL}/about/privacy-policy`,
  cookieNotice: `${GATEWAY_URL}/about/cookie-notice`,
  accessibilityStatement: `${GATEWAY_URL}/about/accessibility-statement`,
};
