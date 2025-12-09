import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Box } from "@mui/material";
import ThemeRegistry from "@/components/ThemeRegistry";
import TopMenu from "@/components/TopMenu";
import HeaderBar from "@/components/HeaderBar";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import InAppMessengerFeatureWrapper from "@/components/InAppMessengerFeatureWrapper";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cohort Discovery Service",
  description: "New cohort discovery tool",
};

const hideNav = process.env.APPLICATION_MODE === "integrated";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value || "";

  return (
    <ThemeRegistry>
      <html lang="en">
        <body className={`${sourceSans.variable} ${geistMono.variable}`}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
          >
            {!hideNav && <HeaderBar />}

            <Box
              sx={{
                p: hideNav ? 0 : 2,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
              }}
            >
              {!hideNav && <TopMenu />}

              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: "secondary.main",
                  p: 3,
                  overflow: "auto",
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
          <InAppMessengerFeatureWrapper token={token} />
        </body>
      </html>
    </ThemeRegistry>
  );
}
