import { Concept, TermDirectoryEntry } from "@/types/api";

/** Concept-array fields on the demographics block (keys of `Demographics`). */
export enum DemographicConceptField {
  Sex = "sex",
  Race = "race",
}

/** OMOP `domain_id` values used to bucket person-level concepts. */
export enum DemographicDomain {
  Gender = "Gender",
  Race = "Race",
}

export const SEX_GUIDANCE =
  "Define the patient sex criteria that should apply. Patient sex information may be unavailable or incomplete in some records.";

export const RACE_GUIDANCE =
  "Define the patient race criteria that should apply. Patient race information may be unavailable or incomplete in some records.";

export const demographicOptionToConcept = (
  option: TermDirectoryEntry,
): Concept => ({
  concept_id: option.concept_id,
  name: option.concept_name,
  category: option.domain_id,
});
