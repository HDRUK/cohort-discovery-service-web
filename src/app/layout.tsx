import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import ThemeRegistry from "./components/ThemeRegistry";
import LeftSidebar from "./components/LeftSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeRegistry>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Box sx={{ display: "flex" }}>
            <LeftSidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: "#fff",
                p: 3,
                overflow: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </body>
      </html>
    </ThemeRegistry>
  );
}
