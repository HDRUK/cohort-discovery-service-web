import { Chip } from "@mui/material";
import { Concept } from "@/types/api";
import { getDomain } from "@/utils/omop";

const computeLabel = (concept: Concept | Concept[] | null): string | undefined => {
  const all: Concept[] = Array.isArray(concept)
    ? concept
    : concept != null
    ? [concept, ...(concept.alternatives ?? [])]
    : [];
  const unique = new Set(
    all.map((c) => getDomain(c, { useDefault: false })).filter(Boolean),
  );
  if (unique.size === 0) return getDomain(concept);
  return unique.size === 1 ? ([...unique][0] as string) : "Mixed";
};

interface DomainChipProps {
  concept?: Concept | Concept[] | null;
  label?: string;
}

const DomainChip = ({ concept, label }: DomainChipProps) => (
  <Chip
    variant="outlined"
    sx={{ bgcolor: "white" }}
    label={concept !== undefined ? computeLabel(concept) : label}
  />
);

export default DomainChip;
