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
import { VALUE_AS_NUMBER_DOMAINS } from "@/config/rules";

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

const getUniqueDomains = (concept: Concept | Concept[] | null): Set<string> => {
  const all: Concept[] = Array.isArray(concept)
    ? concept
    : concept != null
    ? [concept, ...(concept.alternatives ?? [])]
    : [];
  return new Set(
    all.map((c) => getDomain(c, { useDefault: false })).filter(Boolean) as string[],
  );
};

const isValueAsNumberDomain = (concept: Concept | Concept[] | null): boolean => {
  if (concept == null) return false;
  const matches = (c: Concept) =>
    VALUE_AS_NUMBER_DOMAINS.has(c.category.toLowerCase() as OmopTableName);
  if (Array.isArray(concept)) return concept.length > 0 && concept.every(matches);
  return matches(concept);
};

export { codesToOption, getDomainPhrase, getDomainPastPhrase, getDomain, getUniqueDomains, isValueAsNumberDomain };
