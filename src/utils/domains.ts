import { DOMAIN_GUIDANCE_MAP, DOMAIN_MAP } from "@/config/domains";

export const mapDomain = (domain: string) => {
  const key = domain.toLowerCase().trim();
  return DOMAIN_MAP[key] ?? domain;
};

export const mapDomainForGuidance = (domain: string) => {
  const key = domain.toLowerCase().trim();
  return DOMAIN_GUIDANCE_MAP[key] ?? domain;
};
