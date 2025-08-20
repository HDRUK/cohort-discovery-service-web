"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import { CssBaseline } from "@mui/material";
import theme from "../../config/theme";
import { NotifyProvider } from "../../providers/NotifyProvider";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
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
        <NotifyProvider>{children}</NotifyProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
