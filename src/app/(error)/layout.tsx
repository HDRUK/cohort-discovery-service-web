import AppShell from "@/components/AppShell";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import { loadSessionDataOrSignedOut } from "@/server/loadSession";

export default function ErrorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionDataProvider value={loadSessionDataOrSignedOut()}>
      <AppShell>{children}</AppShell>
    </SessionDataProvider>
  );
}
