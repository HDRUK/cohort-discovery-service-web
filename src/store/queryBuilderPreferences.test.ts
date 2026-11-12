import { shouldResetPreferences } from "./queryBuilderPreferences";

describe("shouldResetPreferences", () => {
  it("resets when the owner differs", () => {
    expect(shouldResetPreferences(1, 2)).toBe(true);
  });

  it("keeps preferences for the same user", () => {
    expect(shouldResetPreferences(1, 1)).toBe(false);
  });

  it("resets when no owner was stored", () => {
    expect(shouldResetPreferences(null, 1)).toBe(true);
  });
});
