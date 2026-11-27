import {
  DEFAULT_FLAGS,
  FEATURE_FLAGS,
  FEATURE_FLAG_GROUPS,
  featureFlagDetails,
} from "../featureFlags";

describe("FEATURE_FLAGS", () => {
  it.each(Object.entries(FEATURE_FLAGS))(
    "describes %s and puts it in a known group",
    (_name, { group, description }) => {
      expect(description).not.toBe("");
      expect(FEATURE_FLAG_GROUPS).toContain(group);
    },
  );
});

describe("DEFAULT_FLAGS", () => {
  it("has a default for every flag the web reads", () => {
    const withDefaults = Object.entries(FEATURE_FLAGS)
      .filter(([, flag]) => "default" in flag)
      .map(([name]) => name);

    expect(Object.keys(DEFAULT_FLAGS).sort()).toEqual(withDefaults.sort());
  });

  it("leaves out flags only the API reads", () => {
    expect(DEFAULT_FLAGS).not.toHaveProperty("query-rate-limit");
  });
});

describe("featureFlagDetails", () => {
  it("puts a flag the web doesn't know under Other", () => {
    expect(featureFlagDetails("brand-new-flag")).toEqual({
      group: "Other",
      description: "",
    });
  });
});
