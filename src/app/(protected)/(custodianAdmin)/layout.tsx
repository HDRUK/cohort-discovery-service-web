import AdminPage from "./components/CustodianAdminPage";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPage>{children}</AdminPage>;
}
