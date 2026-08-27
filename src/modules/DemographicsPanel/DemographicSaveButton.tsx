"use client";

import { Button, Stack } from "@mui/material";

interface DemographicSaveButtonProps {
  onReset: () => void;
  onSave: () => void;
}

const DemographicSaveButton = ({
  onReset,
  onSave,
}: DemographicSaveButtonProps) => (
  <Stack direction={"row"} spacing={1} justifyContent={"flex-end"} my={1}>
    <Button variant="outlined" color="secondary" onClick={onReset}>
      Reset Selection
    </Button>
    <Button color="secondary" onClick={onSave}>
      Save Selection and Collapse
    </Button>
  </Stack>
);

export default DemographicSaveButton;
