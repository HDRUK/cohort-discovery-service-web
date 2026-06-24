import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { OIDC_CONFIG, isOidcEnabled } from "@/lib/oidc";

const issuer = OIDC_CONFIG.issuerUrl?.replace(/\/$/, "");

const setTokenLifetime = (token: JWT, expiresAt?: number) => {
  if (expiresAt) {
    token.accessTokenExpiresAt = expiresAt;
  }

  if (!token.accessTokenExpiresAt) {
    return token;
  }

  token.exp = token.accessTokenExpiresAt;
  return token;
};

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers:
    isOidcEnabled() && issuer
      ? [
          {
            id: "oidc",
            name: "Lifescience Login",
            type: "oauth",
            wellKnown: `${issuer}/.well-known/openid-configuration`,
            clientId: OIDC_CONFIG.clientId,
            client: { token_endpoint_auth_method: "none" },
            authorization: {
              params: {
                scope: OIDC_CONFIG.scopes,
              },
            },
            idToken: true,
            checks: ["pkce", "state", "nonce"],
            profile(profile) {
              return {
                id: String(profile.sub ?? ""),
                name: profile.name,
                email: profile.email,
              };
            },
          },
        ]
      : [],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      if (account?.expires_at) {
        setTokenLifetime(token, Math.floor(account.expires_at));
      }

      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      if (token.accessTokenExpiresAt) {
        session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      }

      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
      }

      return session;
    },
  },
};

