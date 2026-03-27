import { Code } from "@/types/api";
import { Option } from "@/types/common";
import {
  DEFAULT_DOMAIN_PHRASE,
  DOMAIN_PHRASES,
  DomainPhrase,
  OmopTableName,
} from "@/types/omop";

const codesToOption = (codes: Code[]): Option[] =>
  codes
    ?.filter((code) => code.name !== "0")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((code) => ({
      name: code.name,
      label: `${code.name} (${code.name}) `,
    }));

export const getDomainPhrase = (category?: string): DomainPhrase => {
  if (!category) return DEFAULT_DOMAIN_PHRASE;

  return (
    DOMAIN_PHRASES[category.toLowerCase() as OmopTableName] ??
    DEFAULT_DOMAIN_PHRASE
  );
};

export { codesToOption, getDomainPhrase };
