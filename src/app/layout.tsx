import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import ThemeRegistry from "@/components/ThemeRegistry";
import TopMenu from "@/components/TopMenu";
import HeaderBar from "@/components/HeaderBar";
import { isStandalone } from "@/utils/modes";
import Footer from "@/components/Footer";
import ServerDefaultProvider from "@/providers/ServerDefaultProvider";
import SupportPopOut from "@/components/SupportPopOut/SupportPopOut";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";

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

const hideNav = process.env.HIDE_NAV === "1";
const applicationMode = process.env.APPLICATION_MODE;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const standalone = isStandalone(applicationMode);

  return (
    <ApplicationModeProvider applicationMode={applicationMode}>
      <ThemeRegistry>
        <html lang="en">
          <body className={`${sourceSans.variable} ${geistMono.variable}`}>
            <ServerDefaultProvider>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "120vh",
                  }}
                >
                  {!standalone && <SupportPopOut />}

                  {!hideNav && <HeaderBar />}

                  <Box
                    sx={{
                      py: hideNav ? 0 : 1,
                      px: hideNav ? 0 : 2,
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
                        p: 2,
                        overflow: "auto",
                      }}
                    >
                      {children}
                    </Box>
                  </Box>
                </Box>
                <Footer />
              </Box>
            </ServerDefaultProvider>
          </body>
        </html>
      </ThemeRegistry>
    </ApplicationModeProvider>
  );
}
