"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { ctaButtonSx, headingSx, rootSx } from "./LoginLanding.styles";

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
    sx={rootSx(visible)}
  >
    <Typography component="h1" sx={headingSx}>
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
        sx={ctaButtonSx}
      >
        Log in
      </Button>
    </Box>
  </Stack>
);

export default LoginLanding;
