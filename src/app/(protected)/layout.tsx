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
    <Suspense fallback={<SkeletonFull sx={{ minHeight: "100dvh" }} />}>
      <SessionGate>
        <AppShell>{children}</AppShell>
      </SessionGate>
    </Suspense>
  );
}
