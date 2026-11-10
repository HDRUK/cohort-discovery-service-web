/**
 * @jest-environment node
 */
import jwt from "jsonwebtoken";
import { SessionRedirectArgs, sessionRedirect } from "../sessionRedirect";

const NOW = 1_700_000_000;

const tokenExpiringAt = (exp: number) =>
  jwt.sign({ user: { id: 1 }, exp }, "test-secret");

const redirectFor = (args: Partial<SessionRedirectArgs>) =>
  sessionRedirect({
    token: undefined,
    nowSeconds: NOW,
    pathname: "/admin/collections",
    search: "",
    standalone: true,
    ...args,
  });

describe("sessionRedirect", () => {
  it("sends a logged-out standalone user to login with a return path", () => {
    expect(redirectFor({ search: "?page=2" })).toBe(
      "/login?return_to=%2Fadmin%2Fcollections%3Fpage%3D2",
    );
  });

  it("sends a logged-out standalone user at the root to plain login", () => {
    expect(redirectFor({ pathname: "/" })).toBe("/login");
  });

  it("sends a logged-out integrated user to the no-token 403", () => {
    expect(redirectFor({ standalone: false })).toBe("/403?reason=no-token");
  });

  it("treats a token that does not decode as missing", () => {
    expect(redirectFor({ token: "not-a-jwt", standalone: false })).toBe(
      "/403?reason=no-token",
    );
  });

  it("sends an expired token to logout", () => {
    expect(redirectFor({ token: tokenExpiringAt(NOW) })).toBe(
      "/api/auth/logout",
    );
  });

  it("lets a valid token through", () => {
    expect(redirectFor({ token: tokenExpiringAt(NOW + 60) })).toBeNull();
  });

  it.each(["/login", "/auth/sso/callback", "/about/privacy-policy", "/403"])(
    "ignores the public path %s",
    (pathname) => {
      expect(redirectFor({ pathname })).toBeNull();
    },
  );

  it("does not treat a path that only shares a prefix as public", () => {
    expect(redirectFor({ pathname: "/login-history" })).not.toBeNull();
  });

  it("returns relative paths only", () => {
    [
      redirectFor({}),
      redirectFor({ standalone: false }),
      redirectFor({ token: tokenExpiringAt(NOW) }),
    ].forEach((path) => expect(path).toMatch(/^\/[^/]/));
  });
});
