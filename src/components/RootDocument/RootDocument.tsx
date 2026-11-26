import { Source_Sans_3, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import "@material-symbols/font-400/rounded.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import ServerDefaultProvider from "@/providers/ServerDefaultProvider";
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

const inter = Inter({
  variable: "--font-inter",
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

const applicationMode = process.env.APPLICATION_MODE;

export interface RootDocumentProps {
  children: React.ReactNode;
}

const RootDocument = ({ children }: RootDocumentProps) => (
  <ApplicationModeProvider applicationMode={applicationMode}>
    <ThemeRegistry>
      <html lang="en">
        <body
          className={`${sourceSans.variable} ${geistMono.variable} ${inter.variable}`}
        >
          <ServerDefaultProvider>{children}</ServerDefaultProvider>
        </body>
      </html>
    </ThemeRegistry>
  </ApplicationModeProvider>
);

export default RootDocument;
