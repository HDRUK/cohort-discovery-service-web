import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import SkeletonFull from "@/components/SkeletonFull";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import { loadSession } from "@/server/loadSession";
import SessionGate from "./components/SessionGate";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = loadSession();

  return (
    <SessionDataProvider value={session.then(({ data }) => data)}>
      <AppShell>
        <Suspense fallback={<SkeletonFull />}>
          <SessionGate session={session}>{children}</SessionGate>
        </Suspense>
      </AppShell>
    </SessionDataProvider>
  );
}
