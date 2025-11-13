import "@mui/material/styles";
import "@mui/material/Chip";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
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
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    guidance1: true;
    guidance2: true;
  }
}
