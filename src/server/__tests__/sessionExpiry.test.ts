import { msUntilSessionEnds } from "../sessionExpiry";

describe("msUntilSessionEnds", () => {
  const NOW = 1_700_000_000;

  it("ends the session 30 seconds before the token expires", () => {
    expect(msUntilSessionEnds(NOW + 90, NOW)).toBe(60_000);
  });

  it("ends the session straight away once inside the skew", () => {
    expect(msUntilSessionEnds(NOW + 10, NOW)).toBe(0);
  });

  it("ends the session straight away when the token has expired", () => {
    expect(msUntilSessionEnds(NOW - 100, NOW)).toBe(0);
  });

  it("returns null when the token has no expiry", () => {
    expect(msUntilSessionEnds(undefined, NOW)).toBeNull();
  });

  it("returns null without the request time", () => {
    expect(msUntilSessionEnds(NOW + 90, 0)).toBeNull();
  });
});
