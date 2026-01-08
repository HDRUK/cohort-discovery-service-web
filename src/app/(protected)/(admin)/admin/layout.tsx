import AdminPage from "./components/AdminPage";

const ProtectedAdminPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AdminPage>{children}</AdminPage>;
};

export default ProtectedAdminPageLayout;
