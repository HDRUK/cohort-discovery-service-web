import {
  alpha,
  createTheme,
  responsiveFontSizes,
  Theme,
  ThemeOptions,
} from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { deepmerge } from "@mui/utils";
import { createHdrukTheme } from "@hdruk/ui/theme";
import brandingTheme from "@branding/theme";

const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#3db28c",
      light: "#6fd3b2",
      dark: "#2a8c6e",
      contrastText: "#fff",
    },
    secondary: {
      main: "#475da7",
      light: "#6c7cc0",
      dark: "#354681",
      contrastText: "#fff",
    },
    tertiary: {
      midnightBlue: { main: "#29235c", contrastText: "#fff" },
      duckEggBlue: { main: "#addad9", contrastText: "#111" },
      slateGrey: { main: "#3c3c3b", contrastText: "#fff" },
      lightGrey: { main: "#d0d3d4", contrastText: "#111" },
      orange: { main: "#f98e2b", contrastText: "#111" },
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#fff",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#fff",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#fff",
    },
    text: {
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    link: {
      main: "#475da7",
      dark: undefined,
      light: undefined,
      contrastText: undefined,
    },
    divider: "#d0d3d4",
  },
  shape: {
    borderRadius: 8,
  },
  zIndex: {
    drawer: 2,
  },
  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
    },
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
      fontWeight: 400,
    },
    h6: {
      fontSize: "15px",
      fontWeight: 200,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: "15px",
      fontWeight: 400,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
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
    MuiCssBaseline: {
      styleOverrides: undefined,
    },
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
          minHeight: undefined,
          padding: undefined,
          lineHeight: undefined,
          "&:focus-visible": undefined,
          "&.Mui-disabled": undefined,
        },
        contained: ({ theme }) => ({
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.main}`,
            outlineOffset: 2,
          },
        }),
        outlined: {
          "--variant-outlinedBorder": undefined,
          padding: undefined,
          "&:hover, &.Mui-disabled": undefined,
        },
        outlinedSizeSmall: {
          padding: undefined,
        },
        sizeSmall: ({ theme }) => ({
          minHeight: undefined,
          lineHeight: undefined,
          padding: undefined,
          paddingInline: theme.spacing(1.5),
          paddingBlock: theme.spacing(0.5),
        }),
        sizeLarge: ({ theme }) => ({
          paddingInline: theme.spacing(2.5),
          paddingBlock: theme.spacing(1.25),
        }),
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            "&:focus-visible": {
              backgroundColor: "var(--variant-containedBg)",
            },
          },
        },
        {
          props: { variant: "contained", color: "error" },
          style: {
            "&:focus-visible": {
              backgroundColor: "var(--variant-containedBg)",
            },
          },
        },
        {
          props: { variant: "outlined", color: "secondary" },
          style: {
            color: "var(--variant-outlinedColor)",
            borderColor: "var(--variant-outlinedBorder, currentColor)",
            "&:hover, &:focus-visible": {
              color: "var(--variant-outlinedColor)",
              borderColor: "var(--variant-outlinedBorder, currentColor)",
              backgroundColor: "var(--variant-outlinedBg)",
            },
          },
        },
        {
          props: { variant: "text", color: "inherit" },
          style: {
            color: "inherit",
            "&:hover": {
              backgroundColor: "var(--variant-textBg)",
            },
          },
        },
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
    MuiIconButton: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: undefined,
          borderRadius: theme.shape.borderRadius,
          "& .MuiIcon-root, & .MuiSvgIcon-root": undefined,
          "&:hover": undefined,
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.main}`,
            outlineOffset: 2,
            backgroundColor: undefined,
          },
          "&.Mui-disabled": undefined,
        }),
        sizeSmall: {
          fontSize: undefined,
        },
        sizeMedium: {
          fontSize: undefined,
        },
        sizeLarge: {
          padding: undefined,
        },
      },
      variants: [
        {
          props: { color: "default" },
          style: ({ theme }) => ({
            color: theme.palette.action.active,
          }),
        },
        {
          props: { color: "inherit" },
          style: {
            "&:hover, &:focus-visible": {
              backgroundColor: "transparent",
            },
            "&:hover": {
              backgroundColor: "var(--IconButton-hoverBg)",
            },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          "&:hover .MuiOutlinedInput-notchedOutline": undefined,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": undefined,
        },
        input: {
          padding: undefined,
          paddingTop: undefined,
          paddingBlock: 12,
          paddingInline: 14,
        },
      },
      variants: [
        {
          props: { multiline: true },
          style: {
            padding: "16.5px 14px",
            paddingTop: "16.5px",
          },
        },
        {
          props: { multiline: true, size: "small" },
          style: {
            padding: "8.5px 14px",
            paddingTop: "8.5px",
          },
        },
      ],
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: undefined,
          "&:before": undefined,
        },
        input: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        slotProps: { list: { disablePadding: false } },
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
        list: {
          paddingBlock: 4,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: (theme.shape.borderRadius as number) - 2,
          marginInline: 4,
          "&:hover": undefined,
          "&.Mui-selected, &.Mui-selected:is(:hover, :focus)": undefined,
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: (theme.shape.borderRadius as number) + 4,
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: undefined,
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
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: "body1",
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
          height: undefined,
          minHeight: undefined,
          padding: undefined,
          gap: undefined,
          borderRadius: 20,
          fontSize: undefined,
          fontWeight: undefined,
          lineHeight: undefined,
          "&.Mui-focusVisible": undefined,
          "&.Mui-disabled": undefined,
        }),
        outlined: () => ({
          padding: undefined,
          backgroundColor: undefined,
          "&.MuiChip-clickable:hover": undefined,
          "&.Mui-focusVisible": undefined,
        }),
        label: { padding: undefined },
        icon: () => ({ margin: undefined, fontSize: undefined }),
        avatar: { margin: undefined },
        deleteIcon: { margin: undefined },
      },
      variants: [
        {
          props: { variant: "filled", color: "warning" },
          style: ({ theme }) => ({
            color: theme.palette.warning.contrastText,
          }),
        },
        {
          props: { variant: "outlined", color: "warning" },
          style: ({ theme }) => ({
            color: theme.palette.warning.main,
          }),
        },
        {
          props: { variant: "outlined", color: "default" },
          style: ({ theme }) => ({
            borderColor: theme.palette.grey[400],
            "&.MuiChip-clickable:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }),
        },
        ...(["primary", "success", "warning", "error"] as const).map(
          color => ({
            props: { variant: "outlined" as const, color },
            style: ({ theme }: { theme: Theme }) => ({
              borderColor: alpha(theme.palette[color].main, 0.7),
              "&.MuiChip-clickable:hover": {
                borderColor: alpha(theme.palette[color].main, 0.7),
              },
            }),
          }),
        ),
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: undefined,
          color: undefined,
          fontSize: undefined,
          padding: undefined,
          maxWidth: undefined,
        },
        arrow: {
          color: undefined,
        },
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
    MuiDateCalendar: {
      styleOverrides: undefined,
    },
    MuiPickersCalendarHeader: {
      styleOverrides: undefined,
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: undefined,
    },
    MuiDayCalendar: {
      styleOverrides: undefined,
    },
    MuiPickersDay: {
      styleOverrides: undefined,
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        yearsPerRow: undefined,
      },
    },
    MuiMonthCalendar: {
      styleOverrides: undefined,
    },
    MuiYearCalendar: {
      styleOverrides: undefined,
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

export const siteTheme = responsiveFontSizes(createHdrukTheme(themeOptions));

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
