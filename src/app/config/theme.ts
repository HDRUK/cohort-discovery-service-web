import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#8FA99C",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#CCD7D5",
      contrastText: "#ffffff",
    },
    text: {
      //default: "#4D5B59",
    },
    background: {
      default: "#fff",
      paper: "#fff",
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
});

theme = createTheme(theme, {
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#4D5B59",
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: "#4D5B59",
              color: theme.palette.primary.contrastText,
            },
          },
          "&:hover": {
            color: "#4D5B59",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#f9f9f9",
            color: "#000",
          },
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          backgroundColor: "#f9f9f9",
          width: "100%",
          p: 2,
          m: 0,
        },
      },
    },
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
          backgroundColor: "#ffffff",
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
