import { Chip } from "@mui/material";
import { Concept } from "@/types/api";
import { getDomain, getUniqueDomains } from "@/utils/omop";

const computeLabel = (concept: Concept | Concept[] | null): string | undefined => {
  const unique = getUniqueDomains(concept);
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
