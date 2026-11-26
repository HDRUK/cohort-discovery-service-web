import { Suspense } from "react";
import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import RootDocument from "@/components/RootDocument";
import SkeletonFull from "@/components/SkeletonFull";
import { ROOT_METADATA } from "@/config/metadata";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import { loadSession } from "@/server/loadSession";
import SessionGate from "./components/SessionGate";

export const metadata: Metadata = ROOT_METADATA;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = loadSession();

  return (
    <RootDocument>
      <SessionDataProvider value={session.then(({ data }) => data)}>
        <AppShell>
          <Suspense fallback={<SkeletonFull />}>
            <SessionGate session={session}>{children}</SessionGate>
          </Suspense>
        </AppShell>
      </SessionDataProvider>
    </RootDocument>
  );
}
