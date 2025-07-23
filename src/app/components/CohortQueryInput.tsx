"use client";

import { TextField } from "@mui/material";

const CohortQueryInput = () => {
  return (
    <TextField
      name="cohortQueryInput"
      label="Cohort Query"
      placeholder="Search for a cohort e.g. females above 50 with diabetes type-ii"
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        width: "70%",
        my: 10,
      }}
    />
  );
};

export default CohortQueryInput;
