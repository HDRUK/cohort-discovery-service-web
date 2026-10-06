import { ThemeOptions } from "@mui/material/styles";

const brandingTheme: ThemeOptions = {
  palette: {
    success: {
      main: "#3db28c",
      light: "#6edbb0",
      dark: "#2b7e61",
      contrastText: "#ffffff",
    },
    highlight: {
      main: "#E9ECF4",
    },
    table: {
      main: "#CCD7D5",
    },
    text: {
      primary: "#4D5B59",
      secondary: "#878E95",
    },
    background: {
      default: "#F2F2F2",
      paper: "#FAFAFA",
    },
    link: {
      main: "#475da7",
    },
    action: {
      disabledBackground: "#F0F0F0",
    },
    tooltip: { main: "#475da7" },
    yellowCustom: {
      main: "#F4E751",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#3C3C3B",
    },
    secondaryBlack: {
      main: "#3C3C3B",
    },
    sage: {
      main: "#C6D9D4",
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", sans-serif',
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
  },
};

export default brandingTheme;
