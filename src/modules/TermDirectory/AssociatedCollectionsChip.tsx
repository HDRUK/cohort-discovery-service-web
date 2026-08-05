import { Chip } from "@mui/material";

const AssociatedCollectionsChip = ({ count }: { count: number }) => (
  <Chip
    size="small"
    label={`${count} Collection${count === 1 ? "" : "s"}`}
    sx={{ bgcolor: "tooltip.main", color: "white" }}
  />
);

export default AssociatedCollectionsChip;
