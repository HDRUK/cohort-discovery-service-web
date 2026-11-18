import { ConfigurationSection } from "@/types/configuration";

export const CONFIGURATION_SECTION_PARAM = "section";

export const DEFAULT_CONFIGURATION_SECTION = ConfigurationSection.Flags;

export const CONFIGURATION_SECTION_LABELS: Record<
  ConfigurationSection,
  string
> = {
  [ConfigurationSection.Flags]: "Feature flags",
  [ConfigurationSection.Defaults]: "Defaults",
  [ConfigurationSection.AccessControl]: "Access control",
};
