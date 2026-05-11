import { Code, Concept } from "@/types/api";
import { Option } from "@/types/common";
import {
  DEFAULT_DOMAIN_PHRASE,
  DOMAIN_PHRASES,
  DomainPhrase,
  OmopTableName,
} from "@/types/omop";
import { capitaliseFirstLetter } from "./string";
import { DOMAIN_MAP } from "@/config/domains";

const codesToOption = (codes: Code[]): Option[] =>
  codes
    ?.filter((code) => code.name !== "0")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((code) => ({
      name: code.name,
      label: `${code.name} (${code.name}) `,
    }));

const getDomainPhrase = (category?: string): DomainPhrase => {
  if (!category) return DEFAULT_DOMAIN_PHRASE;

  return (
    DOMAIN_PHRASES[category.toLowerCase() as OmopTableName] ??
    DEFAULT_DOMAIN_PHRASE
  );
};

const getPastPhrase = ({ pastPrefix, verbPast }: DomainPhrase): string =>
  [pastPrefix, verbPast].filter(Boolean).join(" ");

const getDomainPastPhrase = (category?: string): string =>
  getPastPhrase(getDomainPhrase(category));

const getDomain = (
  concept: Concept | Concept[] | null,
  options: { useDefault?: boolean } = {},
): string | undefined => {
  const { useDefault = true } = options;

  const domain = Array.isArray(concept)
    ? concept[0]?.category
    : concept?.category;

  if (!domain && !useDefault) return undefined;

  const { noun } = getDomainPhrase(domain);
  const mapped = DOMAIN_MAP[noun] ?? noun;

  return capitaliseFirstLetter(mapped);
};

export { codesToOption, getDomainPhrase, getDomainPastPhrase, getDomain };
