export const DOMAIN_TAB_FILTERS: Record<string, string[]> = {
  Condition: ["Condition"],
  Observation: ["Observation"],
  Measurement: ["Measurement"],
  Medication: ["Drug"],
  Procedure: ["Procedure"],
  Person: ["Gender", "Race", "Ethnicity"],
};

export const DOMAIN_TABS = Object.keys(DOMAIN_TAB_FILTERS);
