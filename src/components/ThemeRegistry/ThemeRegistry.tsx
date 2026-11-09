"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GlobalStyles from "@mui/material/GlobalStyles";
import { themeOptions } from "../../config/theme";
import { NotifyProvider } from "../../providers/NotifyProvider";
import { HdrukUiProvider } from "@hdruk/ui";
import { ThemeOptions } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import ConfirmProvider from "../ConfirmProvider";
import { getQueryClient } from "@/lib/queryClient";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <AppRouterCacheProvider>
      <HdrukUiProvider themeOptions={themeOptions as ThemeOptions}>
        <ConfirmProvider>
          <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <NotifyProvider>{children}</NotifyProvider>
            </LocalizationProvider>
          </QueryClientProvider>
        </ConfirmProvider>
      </HdrukUiProvider>
    </AppRouterCacheProvider>
  );
}
