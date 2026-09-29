"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface SsoCallbackRedirectProps {
  target: string;
}

const SsoCallbackRedirect = ({ target }: SsoCallbackRedirectProps) => {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 20,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Signing you in…
      </Typography>
    </Box>
  );
};

export default SsoCallbackRedirect;
