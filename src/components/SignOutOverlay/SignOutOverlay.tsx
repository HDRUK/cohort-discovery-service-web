"use client";

import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";

const SignOutOverlay = ({ open }: { open: boolean }) => (
  <Backdrop
    open={open}
    sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: "common.white" }}
  >
    <Stack alignItems="center" spacing={2}>
      <CircularProgress color="inherit" />
      <Typography variant="body1">Signing you out…</Typography>
    </Stack>
  </Backdrop>
);

export default SignOutOverlay;
