import { Code } from "@/types/api";
import { Option } from "@/types/common";
import { DEFAULT_DOMAIN_VERB, DOMAIN_VERBS, DomainVerb } from "@/types/omop";

const codesToOption = (codes: Code[]): Option[] =>
  codes
    ?.filter((code) => code.name !== "0")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((code) => ({
      name: code.name,
      label: `${code.name} (${code.name}) `,
    }));

const getDomainVerbs = (category?: string): DomainVerb => {
  if (!category) return DEFAULT_DOMAIN_VERB;
  return DOMAIN_VERBS[category.toLowerCase()] ?? DEFAULT_DOMAIN_VERB;
};

export { codesToOption, getDomainVerbs };
