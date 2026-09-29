"use client";

import { useEffect } from "react";
import { CircularProgress, Paper, Stack, Typography } from "@mui/material";

interface SsoCallbackRedirectProps {
  target: string;
}

const SsoCallbackRedirect = ({ target }: SsoCallbackRedirectProps) => {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "100px auto" }}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Signing you in…
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SsoCallbackRedirect;
