"use client";

import { Box } from "@mui/material";
import ControlledSearchBox from "@/modules/ControlledSearchBox";

// placeholder component for a future ticket..
const SearchDatasets = () => {
  const onSubmit = () => {
    // to be implemented in another ticket
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        mx: 2,
      }}
    >
      <ControlledSearchBox
        paramName="name"
        inputBgColor="background.default"
        type="search"
        placeholder="I'm looking for..."
        fullWidth
        variant="outlined"
        margin="normal"
      />
    </Box>
  );
};

export default SearchDatasets;
