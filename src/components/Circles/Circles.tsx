"use client";

import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

const DEFAULT_OPACITIES: number[] = [1, 0.5, 0.3];
const ANIMATED_PROPERTIES = [
  "width",
  "height",
  "background-color",
  "margin-right",
];

export interface CirclesProps {
  colour: string;
  diameter: string;
  overlap?: number;
  opacities?: number[];
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

const Circles = ({
  colour,
  diameter,
  overlap = 0.45,
  opacities = DEFAULT_OPACITIES,
  children,
  sx,
}: CirclesProps) => (
  <Box
    sx={[
      { display: "flex", alignItems: "center" },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {opacities.map((opacity, index) => (
      <Box
        key={index}
        sx={(theme) => ({
          width: diameter,
          height: diameter,
          borderRadius: "50%",
          backgroundColor: colour,
          opacity,
          flexShrink: 0,
          position: "relative",
          zIndex: opacities.length - index,
          marginRight:
            index < opacities.length - 1
              ? `calc(${diameter} * -${overlap})`
              : 0,
          transition: theme.transitions.create(ANIMATED_PROPERTIES, {
            duration: 800,
            easing: theme.transitions.easing.easeInOut,
            delay: 150,
          }),
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        })}
      />
    ))}

    {children}
  </Box>
);

export default Circles;
