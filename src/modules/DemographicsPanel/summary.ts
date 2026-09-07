import { Concept } from "@/types/api";
import { GeoRadiusLocation } from "@/types/rules";
import { formatRadius } from "@/components/GeoMap";

export const formatAgeSummary = (age: [number, number] | null): string =>
  age ? `Age ${age[0]}–${age[1]}` : "Age Any";

export const formatLocationSummary = (
  location: GeoRadiusLocation | null,
): string =>
  location ? `Location within ${formatRadius(location.radius)}` : "Location Any";

export const formatConceptCountSummary = (
  label: string,
  concepts: Concept[],
): string =>
  concepts.length === 0
    ? `${label} Any`
    : `${concepts.length} ${label} concept${concepts.length === 1 ? "" : "s"}`;
