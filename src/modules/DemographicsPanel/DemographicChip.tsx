"use client";

import { Chip } from "@mui/material";

type DemographicChipProps = {
  label: string;
  field?: string;
};

const DemographicChip = ({ label, field }: DemographicChipProps) => {
  return (
    <Chip
      variant="outlined"
      data-testid={`${field}-chip`}
      sx={{
        bgcolor: "white",
        // Color/Text/secondaryBlack / HDRUK - Library
        color: "#3C3C3B",
        fontWeight: "400",
      }}
      label={label}
    />
  );
};

export default DemographicChip;
