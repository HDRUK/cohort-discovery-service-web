import {
  getTagCollection,
  getUserQueryTag,
  isAllowedTag,
  TAG_COLLECTIONS_ADMIN,
} from "../tags";

describe("isAllowedTag", () => {
  it("accepts a static tag", () => {
    expect(isAllowedTag(TAG_COLLECTIONS_ADMIN)).toBe(true);
  });

  it("accepts a helper-built tag", () => {
    expect(
      isAllowedTag(getTagCollection("4f9c2b1e-0d1a-4c55-9f3e-1a2b3c4d5e6f")),
    ).toBe(true);
    expect(isAllowedTag(getUserQueryTag(42))).toBe(true);
  });

  it("rejects an unknown tag", () => {
    expect(isAllowedTag("admin")).toBe(false);
  });

  it("rejects a known prefix with no id", () => {
    expect(isAllowedTag(getTagCollection(""))).toBe(false);
  });

  it("rejects a known prefix followed by an unexpected id", () => {
    expect(isAllowedTag(getTagCollection("a/b"))).toBe(false);
    expect(isAllowedTag(getTagCollection("x".repeat(65)))).toBe(false);
  });
});
