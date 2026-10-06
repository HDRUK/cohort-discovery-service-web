import { partitionAuthMethods } from "../authMethods";
import { AuthMethod } from "@/types/api";

const password: AuthMethod = { type: "password", label: "Email and password" };
const keycloak: AuthMethod = {
  type: "oidc",
  slug: "keycloak",
  label: "Single Sign-On",
  redirect_url: "/api/auth/sso/keycloak/redirect",
};
const google: AuthMethod = {
  type: "oidc",
  slug: "google",
  label: "Google",
  redirect_url: "/api/auth/sso/google/redirect",
};

describe("partitionAuthMethods", () => {
  it("splits a mixed list into the password method and the providers", () => {
    const { passwordMethod, providers } = partitionAuthMethods([
      password,
      keycloak,
      google,
    ]);

    expect(passwordMethod).toEqual(password);
    expect(providers).toEqual([keycloak, google]);
  });

  it("returns no providers when only a password method is configured", () => {
    const { passwordMethod, providers } = partitionAuthMethods([password]);

    expect(passwordMethod).toEqual(password);
    expect(providers).toEqual([]);
  });

  it("returns no password method when only providers are configured", () => {
    const { passwordMethod, providers } = partitionAuthMethods([keycloak]);

    expect(passwordMethod).toBeUndefined();
    expect(providers).toEqual([keycloak]);
  });

  it("handles an empty list", () => {
    expect(partitionAuthMethods([])).toEqual({
      passwordMethod: undefined,
      providers: [],
    });
  });

  it("defaults to an empty list when nothing is passed", () => {
    expect(partitionAuthMethods()).toEqual({
      passwordMethod: undefined,
      providers: [],
    });
  });
});
