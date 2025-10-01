import { createTheme } from "@mui/material/styles";

export const themeOptions = {
  palette: {
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
    h4: {
      fontSize: "24px",
      fontWeight: 500,
    },
    h5: {
      fontSize: "24px",
      fontWeight: 200,
      color: "rgba(0, 0, 0, 0.4)",
    },
    h6: {
      fontSize: "14px",
      fontWeight: 200,
      color: "rgba(0, 0, 0, 0.4)",
    },
    body1: {
      fontSize: "18px",
      fontWeight: 400,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#475da7",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "#4D5B59",
              color: "primary.contrastText",
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
      variants: [
        {
          props: { variant: "contained", "data-shape": "curvedRight" },
          style: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
            my: "auto",
          },
        },
        {
          props: { variant: "contained", "data-shape": "curvedLeft" },
          style: {
            borderTopLeftRadius: "1rem",
            borderBottomLeftRadius: "1rem",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            my: "auto",
          },
        },
        // You can add contained/text versions the same way if needed
      ],
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
};

let theme = createTheme(themeOptions);

theme = createTheme(theme, {
  palette: {
    ...theme.palette,
    link: theme.palette.augmentColor({
      color: { main: "#475da7" },
      name: "link",
    }),
  },
});

export default theme;
