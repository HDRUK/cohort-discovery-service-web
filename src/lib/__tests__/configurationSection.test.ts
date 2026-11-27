import { toConfigurationSection } from "@/lib/configurationSection";
import { ConfigurationSection } from "@/types/configuration";

describe("toConfigurationSection", () => {
  it("accepts a known section", () => {
    expect(toConfigurationSection("access-control")).toBe(
      ConfigurationSection.AccessControl,
    );
  });

  it.each([null, "", "unknown", "Flags"])(
    "falls back to feature flags for %p",
    (value) => {
      expect(toConfigurationSection(value)).toBe(ConfigurationSection.Flags);
    },
  );
});
