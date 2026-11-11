import { routes } from "@/config/routes";
import { getOrganisationUrl } from "@/config/externalLinks";

export const signInUrl = (
  isStandaloneMode: boolean,
  loginUrl: string | undefined,
): string => {
  if (isStandaloneMode) return routes.login;
  return loginUrl || getOrganisationUrl();
};
