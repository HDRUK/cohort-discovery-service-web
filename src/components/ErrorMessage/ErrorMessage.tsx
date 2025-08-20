"use client";

import { Box } from "@mui/material";

export function ErrorMessage({ title }: { title: string }) {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#fee",
        border: "1px solid #f99",
        borderRadius: 4,
      }}
    >
      <strong>{title}</strong>
    </Box>
  );
}
