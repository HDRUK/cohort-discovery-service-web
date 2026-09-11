import { Concept } from "@/types/api";
import { GeoRadiusLocation, DEATH_OPTIONS } from "@/types/rules";
import { Option } from "@/types/common";
import { formatRadius } from "@/components/GeoMap";

export const formatAgeSummary = (age: [number, number] | null): string =>
  age ? `Age ${age[0]}–${age[1]}` : "Age Any";

export const formatLocationSummary = (
  location: GeoRadiusLocation | null,
): string =>
  location
    ? `Location within ${formatRadius(location.radius)}`
    : "Location Any";

export const formatDeathSummary = (death: Option | null): string => {
  return death
    ? `Death ${
        death?.value === 0
          ? // No death recorded
            DEATH_OPTIONS[0].label.toLowerCase()
          : // Death recorded
            DEATH_OPTIONS[1].label.toLowerCase()
      }`
    : "Death Any";
};

export const formatConceptCountSummary = (
  label: string,
  concepts: Concept[],
): string =>
  concepts.length === 0
    ? `${label} Any`
    : `${concepts.length} ${label} concept${concepts.length === 1 ? "" : "s"}`;
