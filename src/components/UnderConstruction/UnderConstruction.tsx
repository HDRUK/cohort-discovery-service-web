"use client";

import { useRouter } from "next/navigation";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <Box sx={{ height: "100%", p: 2, display: "grid", placeItems: "center" }}>
      <Paper
        sx={{
          width: "100%",
          maxWidth: 720,
          p: 4,
          border: 1,
          borderColor: "warning.main",
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ConstructionRoundedIcon color="warning" />
            <Typography variant="h4">Under construction</Typography>
          </Box>

          <Typography color="text.secondary">
            This section isn’t available yet.
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => router.back()}
            >
              Go back
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
