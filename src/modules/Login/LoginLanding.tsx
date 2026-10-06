"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import branding from "@branding/branding.config";
import { ctaButtonSx, headingSx, rootSx } from "./LoginLanding.styles";

const productNameSuffix = branding.productLongName
  .replace(branding.productName, "")
  .trim();

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
      {branding.productName}{" "}
      <Box
        component="span"
        sx={{ fontWeight: 400, color: "secondaryBlack.main" }}
      >
        {productNameSuffix}
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
