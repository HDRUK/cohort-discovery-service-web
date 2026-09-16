"use client";

import { Button, Stack } from "@mui/material";

interface DemographicSaveButtonProps {
  onSave: () => void;
  onReset?: () => void;
  allOpen?: boolean;
}

const DemographicSaveButton = ({
  onSave,
  onReset,
  allOpen,
}: DemographicSaveButtonProps) => (
  <Stack
    direction={"row"}
    spacing={1}
    justifyContent={"flex-end"}
    sx={{
      position: "sticky",
      bottom: 0,
      zIndex: 1,
      bgcolor: "background.paper",
      py: 1,
    }}
  >
    {onReset && !allOpen && (
      <Button variant="outlined" color="secondary" onClick={onReset}>
        Reset Selection
      </Button>
    )}
    <Button color="secondary" onClick={onSave}>
      Save Selection and Collapse
    </Button>
  </Stack>
);

export default DemographicSaveButton;
