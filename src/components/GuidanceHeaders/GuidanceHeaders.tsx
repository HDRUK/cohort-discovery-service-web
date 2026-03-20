import { Typography } from "@mui/material";
import { ReactNode } from "react";

export function CustomH1({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <Typography
      variant="guidance1"
      sx={{ borderBottom: 1, borderColor: "grey.600", fontSize: 14, my: 1 }}
    >
      {children}
    </Typography>
  );
}

export function CustomH2({ children }: { children: ReactNode }) {
  return <Typography variant="guidance2">{children}</Typography>;
}
