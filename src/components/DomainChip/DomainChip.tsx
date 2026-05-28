import { Chip } from "@mui/material";

const DomainChip = ({ label }: { label: string | undefined }) => (
  <Chip variant="outlined" sx={{ bgcolor: "white" }} label={label} />
);

export default DomainChip;
