"use client";

import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
import { useSignOutStore } from "@/store/signOutStore";

const SignOutOverlay = () => {
  const isSigningOut = useSignOutStore((s) => s.isSigningOut);

  return (
    <Backdrop
      open={isSigningOut}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: "#fff" }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress color="inherit" />
        <Typography variant="body1">Signing you out…</Typography>
      </Stack>
    </Backdrop>
  );
};

export default SignOutOverlay;
