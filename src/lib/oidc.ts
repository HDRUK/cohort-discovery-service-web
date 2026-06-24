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

let cachedDiscovery: Record<string, unknown> | null = null;
let discoveryFetched = false;

const getDiscovery = async (): Promise<Record<string, unknown> | null> => {
  if (discoveryFetched) return cachedDiscovery;

  discoveryFetched = true;
  const issuer = OIDC_CONFIG.issuerUrl?.replace(/\/$/, "");
  if (!issuer) return null;

  try {
    const res = await fetch(`${issuer}/.well-known/openid-configuration`);
    cachedDiscovery = await res.json();
    return cachedDiscovery;
  } catch {
    return null;
  }
};

export const getOidcEndSessionEndpoint = async (): Promise<string | null> => {
  const discovery = await getDiscovery();
  return (discovery?.end_session_endpoint as string) ?? null;
};

