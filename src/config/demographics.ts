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

export const demographicGuidance = (demographic: string): string =>
  `Define the patient ${demographic} criteria that should apply. Patient ${demographic} information may be unavailable or incomplete in some records.`;

export const locationGuidance =
  "Search for a place or click the map to drop a pin, then set a radius to match patients whose recorded location falls within that area. Leave blank to include all locations.";

export const demographicOptionToConcept = (
  option: TermDirectoryEntry,
): Concept => ({
  concept_id: option.concept_id,
  name: option.concept_name,
  category: option.domain_id,
});
