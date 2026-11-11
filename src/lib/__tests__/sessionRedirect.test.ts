import {
  isSessionExpired,
  msUntilSessionEnds,
  signedOutRedirect,
} from "../sessionRedirect";

describe("signedOutRedirect", () => {
  it("sends a standalone user to login with the page they asked for", () => {
    expect(signedOutRedirect(true, "/admin/collections?page=2")).toBe(
      "/login?return_to=%2Fadmin%2Fcollections%3Fpage%3D2",
    );
  });

  it.each([
    ["the root", "/"],
    ["no known path", null],
  ])("sends a standalone user at %s to plain login", (_, requestedPath) => {
    expect(signedOutRedirect(true, requestedPath)).toBe("/login");
  });

  it("sends an integrated user to the no-token 403", () => {
    expect(signedOutRedirect(false, "/admin/collections")).toBe(
      "/403?reason=no-token",
    );
  });

  it("returns relative paths only", () => {
    [
      signedOutRedirect(true, "/term-directory"),
      signedOutRedirect(true, null),
      signedOutRedirect(false, "/term-directory"),
    ].forEach((path) => expect(path).toMatch(/^\/[^/]/));
  });
});

describe("isSessionExpired", () => {
  const NOW = 1_700_000_000;

  it("treats a token at or past its expiry as expired", () => {
    expect(isSessionExpired(NOW, NOW)).toBe(true);
    expect(isSessionExpired(NOW - 1, NOW)).toBe(true);
  });

  it("keeps a token before its expiry", () => {
    expect(isSessionExpired(NOW + 60, NOW)).toBe(false);
  });

  it("keeps a token without an expiry", () => {
    expect(isSessionExpired(undefined, NOW)).toBe(false);
  });

  it("can't decide without the request time", () => {
    expect(isSessionExpired(NOW - 60, 0)).toBe(false);
  });
});

describe("msUntilSessionEnds", () => {
  const NOW_MS = 1_700_000_000_000;
  const NOW_SECONDS = NOW_MS / 1000;

  it("ends the session 30 seconds before the token expires", () => {
    expect(msUntilSessionEnds(NOW_SECONDS + 90, NOW_MS)).toBe(60_000);
  });

  it("ends the session straight away once inside the skew", () => {
    expect(msUntilSessionEnds(NOW_SECONDS + 10, NOW_MS)).toBe(0);
  });

  it("ends the session straight away when the token has expired", () => {
    expect(msUntilSessionEnds(NOW_SECONDS - 100, NOW_MS)).toBe(0);
  });

  it("returns null when the token has no expiry", () => {
    expect(msUntilSessionEnds(undefined, NOW_MS)).toBeNull();
  });
});
