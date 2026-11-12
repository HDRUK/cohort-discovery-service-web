import { ClientTokenUser, TokenUser } from "@/types/api";

export const toClientTokenUser = ({
  sso_provider,
  orcid,
  is_admin,
  cohort_admin_teams,
}: TokenUser): ClientTokenUser => ({
  sso_provider,
  orcid,
  is_admin,
  cohort_admin_teams,
});
