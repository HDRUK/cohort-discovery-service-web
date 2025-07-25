"use client";
import { ReactNode, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import { CssBaseline } from "@mui/material";
import { useDaphneStore } from "../store/useDaphneStore";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3c7ea7",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#b58d5b",
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

  const { clearStates } = useDaphneStore();

  useEffect(() => {
    clearStates();
  }, [clearStates]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            body: {
              margin: 0,
              width: "100%",
              height: "100%",
            },
            main: {
              height: "100%",
            },
          }}
        />
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
