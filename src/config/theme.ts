import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { deepmerge } from "@mui/utils";
import brandingTheme from "@branding/theme";

const baseThemeOptions: ThemeOptions = {
  zIndex: {
    drawer: 2,
  },
  typography: {
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
            backgroundColor: "#EEEEEE",
            "&:hover": {
              backgroundColor: "#EEEEEE",
            },
          },
          "&:hover": {
            backgroundColor: theme.palette.highlight.main,
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
        {
          props: { color: "yellowCustom" },
          style: {
            root: ({ theme }: { theme: Theme }) => ({
              color: theme.palette.yellowCustom?.contrastText,
              borderColor: theme.palette.yellowCustom?.main,
              "&:active": {
                background: theme.palette.yellowCustom?.main,
              },
              "&:hover": {
                background: theme.palette.yellowCustom?.main,
              },
            }),
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

export const themeOptions: ThemeOptions = deepmerge(
  baseThemeOptions,
  brandingTheme,
);

let theme = createTheme(themeOptions);

theme = createTheme(theme, {
  palette: {
    ...theme.palette,
    link: theme.palette.augmentColor({
      color: { main: theme.palette.link.main },
      name: "link",
    }),
  },
});

export default theme;
