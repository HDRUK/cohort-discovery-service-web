import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import ThemeRegistry from "./components/ThemeRegistry";
import LeftSidebar from "./components/LeftSidebar";
import HeaderBar from "./components/HeaderBar";

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
  title: "Project Daphne",
  description: "New cohort discovery tool",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeRegistry>
      <html lang="en">
        <body className={`${sourceSans.variable} ${geistMono.variable}`}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
          >
            <HeaderBar />
            <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
              <LeftSidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  bgcolor: "primary.main",
                  p: 3,
                  overflow: "auto",
                }}
              >
                <Box sx={{ flexGrow: 1, bgcolor: "#fff" }}>{children}</Box>
              </Box>
            </Box>
          </Box>
        </body>
      </html>
    </ThemeRegistry>
  );
}
