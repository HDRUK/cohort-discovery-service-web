import { DEFAULT_CONFIGURATION_SECTION } from "@/config/configuration";
import { ConfigurationSection } from "@/types/configuration";

const SECTIONS = Object.values(ConfigurationSection) as string[];

const isConfigurationSection = (
  value: string | null,
): value is ConfigurationSection => !!value && SECTIONS.includes(value);

export const toConfigurationSection = (
  value: string | null,
): ConfigurationSection =>
  isConfigurationSection(value) ? value : DEFAULT_CONFIGURATION_SECTION;
