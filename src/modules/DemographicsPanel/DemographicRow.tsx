"use client";

import { ReactNode } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface DemographicRowProps {
  label: string;
  onEdit?: () => void;
  onClear?: () => void;
  showClear?: boolean;
  children: ReactNode;
}

const DemographicRow = ({
  label,
  onEdit,
  onClear,
  showClear = false,
  children,
}: DemographicRowProps) => (
  <Stack
    direction="row"
    alignItems="flex-start"
    spacing={1}
    sx={{ py: 1, width: "100%" }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        minWidth: 44,
        minHeight: 32,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {label} /
    </Typography>

    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>

    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ minHeight: 32, flexShrink: 0 }}
    >
      {onEdit && (
        <IconButton size="small" aria-label={`Edit ${label}`} onClick={onEdit}>
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      )}
      {showClear && onClear && (
        <Button variant="text" size="small" color="secondary" onClick={onClear}>
          Clear all
        </Button>
      )}
    </Stack>
  </Stack>
);

export default DemographicRow;
