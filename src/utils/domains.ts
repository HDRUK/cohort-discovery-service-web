import { DOMAIN_MAP } from "@/config/domains";

export const mapDomain = (domain: string) => {
  const key = domain.toLowerCase().trim();
  return DOMAIN_MAP[key] ?? domain;
};
