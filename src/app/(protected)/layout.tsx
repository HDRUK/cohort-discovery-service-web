import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import SkeletonFull from "@/components/SkeletonFull";
import SessionGate from "./components/SessionGate";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Suspense fallback={<SkeletonFull />}>
        <SessionGate>{children}</SessionGate>
      </Suspense>
    </AppShell>
  );
}
