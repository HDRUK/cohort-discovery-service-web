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
      sx={(theme) => ({
        bgcolor: "white",
        // Color/Text/secondaryBlack / HDRUK - Library
        color: theme.palette.secondaryBlack.main,
        fontWeight: "400",
      })}
      label={label}
    />
  );
};

export default DemographicChip;
