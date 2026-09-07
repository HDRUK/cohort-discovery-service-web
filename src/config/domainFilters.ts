import { OmopTableName } from "@/types/omop";

export const DOMAIN_TAB_FILTERS = {
  [OmopTableName.Condition]: ["Condition"],
  [OmopTableName.Observation]: ["Observation"],
  [OmopTableName.Measurement]: ["Measurement"],
  [OmopTableName.Drug]: ["Drug"],
  [OmopTableName.Procedure]: ["Procedure"],
  [OmopTableName.Person]: ["Gender", "Race", "Ethnicity"],
};

export type DomainTab = keyof typeof DOMAIN_TAB_FILTERS;

export const DOMAIN_TABS = Object.keys(DOMAIN_TAB_FILTERS) as DomainTab[];
