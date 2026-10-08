import AppShell from "@/components/AppShell";

export default function ErrorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
