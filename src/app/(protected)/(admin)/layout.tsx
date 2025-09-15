import AdminPage from "./components/AdminPage";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPage>{children}</AdminPage>;
}
