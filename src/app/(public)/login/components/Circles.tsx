"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";

type CirclesProps = {
  children: ReactNode;
  scale?: number;
};

const Circles = ({ children, scale = 1 }: CirclesProps) => {
  const baseContainer = { xs: 300, sm: 420 };
  const baseHeight = 200;
  const baseCircle = { xs: 140, sm: 180 };

  const scaleValue = (val: number) => val * scale;
  const scaleResponsive = (val: { xs: number; sm: number }) => ({
    xs: scaleValue(val.xs),
    sm: scaleValue(val.sm),
  });

  return (
    <Box
      sx={{
        position: "relative",
        width: scaleResponsive(baseContainer),
        height: scaleValue(baseHeight),
      }}
    >
      <Box
        sx={(theme) => ({
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: scaleResponsive(baseCircle),
          height: scaleResponsive(baseCircle),
          borderRadius: "50%",
          bgcolor: theme.palette.primary.dark,
          opacity: 0.7,
          zIndex: 2,
        })}
      />
      <Box
        sx={(theme) => ({
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: scaleResponsive(baseCircle),
          height: scaleResponsive(baseCircle),
          borderRadius: "50%",
          bgcolor: theme.palette.primary.main,
          opacity: 0.6,
          zIndex: 1,
        })}
      />
      <Box
        sx={(theme) => ({
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: scaleResponsive(baseCircle),
          height: scaleResponsive(baseCircle),
          borderRadius: "50%",
          bgcolor: theme.palette.primary.light,
          opacity: 0.55,
          zIndex: 2,
        })}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
          zIndex: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Circles;
