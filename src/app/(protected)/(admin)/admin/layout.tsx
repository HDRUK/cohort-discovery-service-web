import { getCollectionHosts } from "@/server/data/collectionHosts";
import { getCollections } from "@/server/data/collections";
import { getUsersList } from "@/server/data/users";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";

const ProtectedAdminPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [{ data: collectionHosts }, { data: collections }, { data: users }] =
    await Promise.all([getCollectionHosts(), getCollections(), getUsersList()]);

  return (
    <AdminSectionProvider
      users={users}
      collections={collections}
      collectionHosts={collectionHosts}
    >
      {children}
    </AdminSectionProvider>
  );
};

export default ProtectedAdminPageLayout;
