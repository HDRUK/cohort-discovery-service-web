import { Concept } from "@/types/api";

/**
 * Fixed demographic concept options rendered as checkboxes in the Demographics
 * panel. Curated by hand here so the shown values can be decided without a
 * round-trip to the API. This could be sourced from an endpoint in the future.
 *
 * concept_id values should be confirmed against the OMOP vocabulary in use.
 */
export interface DemographicOption {
  concept_id: number;
  name: string;
}

export const SEX_CONCEPTS: DemographicOption[] = [
  { concept_id: 8532, name: "Female" },
  { concept_id: 8507, name: "Male" },
  { concept_id: 0, name: "No matching concept" },
  { concept_id: 8551, name: "Unknown" },
];

export const SEX_GUIDANCE =
  "Define the patient sex criteria that should apply. Patient sex information may be unavailable or incomplete in some records.";

export const demographicOptionToConcept = (
  option: DemographicOption,
): Concept => ({
  concept_id: option.concept_id,
  name: option.name,
  category: "Gender",
});
