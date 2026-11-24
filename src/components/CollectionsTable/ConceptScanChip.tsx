import { Chip } from "@mui/material";
import { ConceptScanChipConfig } from "@/types/collections";

const ConceptScanChip = ({ label, color }: ConceptScanChipConfig) => (
  <Chip size="small" variant="outlined" color={color} label={label} />
);

export default ConceptScanChip;
