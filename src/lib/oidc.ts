const OIDC_ENABLED = process.env.OIDC_ENABLED === "true";

export const OIDC_CONFIG = {
  enabled: OIDC_ENABLED,
  issuerUrl: process.env.OIDC_ISSUER_URL,
  clientId: process.env.OIDC_CLIENT_ID,
  scopes: process.env.OIDC_SCOPES ?? "openid profile email",
};

export const isOidcEnabled = () =>
  OIDC_CONFIG.enabled &&
  !!OIDC_CONFIG.issuerUrl &&
  !!OIDC_CONFIG.clientId;

