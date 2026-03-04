import React from "react";
import "@mui/material/styles";
import "@mui/material/Chip";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    link: Palette["primary"];
    highlight: Palette["primary"];
    table?: Palette["primary"];
    tooltip?: Palette["primary"];
    yellowCustom?: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    link?: PaletteOptions["primary"];
    highlight?: PaletteOptions["primary"];
    table?: PaletteOptions["primary"];
    tooltip?: PaletteOptions["primary"];
    yellowCustom?: PaletteOptions["primary"];
  }
  interface TypographyVariants {
    guidance1: React.CSSProperties;
    guidance2: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    guidance1?: React.CSSProperties;
    guidance2?: React.CSSProperties;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    curvedLeft: true;
    curvedRight: true;
  }
  interface ButtonPropsColorOverrides {
    tertiary: true;
    yellowCustom: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    guidance1: true;
    guidance2: true;
  }
}

declare module "@mui/material/Tooltip" {
  interface TooltipProps {
    variant?: "error" | "default";
  }
}

declare module "@src/components/HelpTooltip" {
  interface HelpTooltipPropsColorOverrides {
    tooltip: true;
  }
}
