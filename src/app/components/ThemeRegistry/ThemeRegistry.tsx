"use client";
import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import { CssBaseline } from "@mui/material";
import { useDaphneStore } from "@/store/useDaphneStore";
import theme from "@/config/theme";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const { clearStates, getOmopDefaults, getAllCollections } = useDaphneStore();

  useEffect(() => {
    getOmopDefaults();
  }, [getOmopDefaults]);

  useEffect(() => {
    getAllCollections();
  }, [getAllCollections]);

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
