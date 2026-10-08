"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { FADE_MS } from "./loginStyles";

interface LoginLandingProps {
  visible: boolean;
  onSignIn: () => void;
}

const LoginLanding = ({ visible, onSignIn }: LoginLandingProps) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    alignItems="center"
    justifyContent="center"
    spacing={{ xs: 4, md: 5 }}
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 8,
      px: 3,
      textAlign: { xs: "center", md: "left" },
      opacity: visible ? 1 : 0,
      visibility: visible ? "visible" : "hidden",
      transition: `opacity ${FADE_MS}ms ease-in-out, visibility ${FADE_MS}ms`,
      "@media (prefers-reduced-motion: reduce)": { transition: "none" },
    }}
  >
    <Typography
      component="h1"
      sx={{
        fontSize: "clamp(2rem, 3.7vw, 3.3rem)",
        lineHeight: 1.2,
        color: "text.primary",
        fontWeight: 600,
      }}
    >
      Cohort Discovery{" "}
      <Box
        component="span"
        sx={{ fontWeight: 400, color: "secondaryBlack.main" }}
      >
        Service
      </Box>
    </Typography>

    <Box sx={{ flexShrink: 0 }}>
      <Button
        onClick={onSignIn}
        variant="contained"
        color="secondary"
        sx={{
          borderRadius: 9999,
          px: 3,
          py: 1,
          fontSize: "clamp(1.25rem, 2vw, 2rem)",
          lineHeight: 1.2,
        }}
      >
        Log in
      </Button>
    </Box>
  </Stack>
);

export default LoginLanding;
