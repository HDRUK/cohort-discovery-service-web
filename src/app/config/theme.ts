import { createTheme, alpha } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      dark: "#4D5B59",
      main: "#8FA99C",
      light: "#CCD7D5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E0DBD7",
      contrastText: "#3C3C3B",
    },
    tertiary: {
      //main: "#4D5B59",
      main: "#E0DBD7",
      contrastText: "#ffffff",
    },
    text: {
      //default: "#4D5B59",
    },
    background: {
      default: "#F2F2F2",
      paper: "#F7F7F7",
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
  palette: {
    ...theme.palette,
    link: theme.palette.augmentColor({
      color: { main: "#475DA7" },
      name: "link",
    }),
  },
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
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: theme.palette.background.default,
            color: "#000",
          },
        }),
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          width: "100%",
          p: 2,
          m: 0,
        }),
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
    MuiLink: {
      defaultProps: {
        underline: "always",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          textDecorationColor: theme.palette.link.main,
          color: theme.palette.link.main,
          "&:hover": { color: theme.palette.link.dark },
          "&:visited": { color: theme.palette.link.light },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: () => ({
          boxShadow: "none",
          border: 1,
        }),
      },
    },
  },
});

export default theme;
