"use client";

import { Button, Paper, Stack, Typography } from "@mui/material";
import { errorReference } from "./errorReference";

export interface ErrorPanelProps {
  error: unknown;
  onRetry: () => void;
}

const ErrorPanel = ({ error, onRetry }: ErrorPanelProps) => {
  const reference = errorReference(error);

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", my: 12 }}>
      <Stack spacing={2}>
        <Typography variant="h3" color="error.main">
          Something went wrong
        </Typography>
        <Typography>
          This page couldn&apos;t load. Try again, or come back later if it
          keeps happening.
        </Typography>
        {reference && (
          <Typography variant="body2" color="text.secondary">
            If you report this, quote reference {reference}.
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{ alignSelf: "start" }}
        >
          Try again
        </Button>
      </Stack>
    </Paper>
  );
};

export default ErrorPanel;
