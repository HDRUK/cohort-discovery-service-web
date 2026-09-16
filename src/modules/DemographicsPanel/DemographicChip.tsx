"use client";

import { Chip } from "@mui/material";

type DemographicChipProps = {
  label: string;
};

const DemographicChip = ({ label }: DemographicChipProps) => {
  return (
    <Chip
      variant="outlined"
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
