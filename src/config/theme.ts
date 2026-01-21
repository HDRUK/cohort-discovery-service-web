import { createTheme, ThemeOptions } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";

export const themeOptions: ThemeOptions = {
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
      main: "#1976d2",
      light: "#90caf9",
      dark: "#0d47a1",
    },
    action: {
      disabledBackground: "#F0F0F0",
    },
  },
  zIndex: {
    drawer: 2,
  },
  typography: {
    fontFamily: '"Source Sans 3", sans-serif',
    fontWeightLight: 100,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    h3: {
      fontSize: "1.8rem",
      fontWeight: 400,
    },
    h4: {
      fontSize: "20px",
      fontWeight: 600,
      fontStyle: "normal",
    },
    h5: {
      fontSize: "20px",
      fontWeight: 400,
    },
    h6: {
      fontSize: "15px",
      fontWeight: 200,
    },
    body1: {
      fontSize: "15px",
      fontWeight: 400,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
    overline: {
      fontSize: "15px",
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: "none",
      lineHeight: 1.1,
    },
    guidance1: {
      fontSize: "16px",
      fontWeight: 400,
    },
    guidance2: {
      fontSize: "14px",
      fontWeight: 600,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          "&.Mui-selected": {
            backgroundColor: theme.palette.highlight.main,
            color: theme.palette.success.dark,
            "&:hover": {
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText,
            },
          },
          "&:hover": {
            backgroundColor: theme.palette.highlight.main,
            color: theme.palette.success.dark,
          },
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: ({ theme }) => ({
          color: theme.palette.error.main,
        }),
        root: {
          fontSize: 15,
          fontWeight: 500,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontStyle: "italic",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: "#ffffff",

          "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        }),
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
          props: { variant: "curvedRight" },
          style: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
            my: "auto",
          },
        },
        {
          props: { variant: "curvedLeft" },
          style: {
            borderTopLeftRadius: "1rem",
            borderBottomLeftRadius: "1rem",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            my: "auto",
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        input: {
          paddingTop: 10,
          paddingBottom: 10,
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
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          guidance1: "h1",
          guidance2: "h2",
        },
      },
      styleOverrides: {
        h3: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        h5: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        h6: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: () => ({
          padding: 0,
          "&:last-child": {
            paddingBottom: 0,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: () => ({
          borderRadius: 20,
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        popper: {
          variants: [
            {
              props: { variant: "error" },
              style: ({ theme }) => ({
                [`& .${tooltipClasses.tooltip}`]: {
                  backgroundColor: theme.palette.error.main,
                },
                [`& .${tooltipClasses.arrow}`]: {
                  color: theme.palette.error.main,
                },
              }),
            },
          ],
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 400,
      leavingScreen: 400,
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
