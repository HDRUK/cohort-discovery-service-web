import { Concept } from "@/types/api";

export const formatAgeSummary = (age: [number, number] | null): string =>
  age ? `Age ${age[0]}–${age[1]}` : "Age Any";

export const formatConceptCountSummary = (
  label: string,
  concepts: Concept[],
): string =>
  concepts.length === 0
    ? `${label} Any`
    : `${concepts.length} ${label} concept${concepts.length === 1 ? "" : "s"}`;
