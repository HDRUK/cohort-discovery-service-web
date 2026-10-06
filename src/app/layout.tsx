import type { Metadata } from "next";
import { Source_Sans_3, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import ServerDefaultProvider from "@/providers/ServerDefaultProvider";
import ApplicationModeProvider from "@/providers/ApplicationModeProvider";
import SignOutOverlay from "@/components/SignOutOverlay";
import branding from "@branding/branding.config";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: branding.productLongName,
  description: branding.description,
};

const applicationMode = process.env.APPLICATION_MODE;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ApplicationModeProvider applicationMode={applicationMode}>
      <ThemeRegistry>
        <html lang="en">
          <body
            className={`${sourceSans.variable} ${geistMono.variable} ${inter.variable}`}
          >
            <ServerDefaultProvider>
              {children}
              <SignOutOverlay />
            </ServerDefaultProvider>
          </body>
        </html>
      </ThemeRegistry>
    </ApplicationModeProvider>
  );
}
