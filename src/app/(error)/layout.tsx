import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import RootDocument from "@/components/RootDocument";
import { ROOT_METADATA } from "@/config/metadata";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import { loadSessionDataOrSignedOut } from "@/server/loadSession";

export const metadata: Metadata = ROOT_METADATA;

export default function ErrorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootDocument>
      <SessionDataProvider value={loadSessionDataOrSignedOut()}>
        <AppShell>{children}</AppShell>
      </SessionDataProvider>
    </RootDocument>
  );
}
