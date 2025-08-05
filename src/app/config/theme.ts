import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#29235c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3db28c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
    },
  },
  zIndex: {
    drawer: 2,
  },
  typography: {
    fontFamily: '"tt-commons-pro", sans-serif',
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    h5: {
      fontSize: 32,
    },
    body1: {
      fontSize: 20,
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 20,
          fontWeight: 500,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 20,
          fontStyle: "italic",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-readOnly": {
            color: "gray",
            backgroundColor: "#f0f0f0",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

export default theme;
