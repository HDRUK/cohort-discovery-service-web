import getCollectionHosts from "@/actions/collectionHost/getCollectionHosts";
import getCollections from "@/actions/collection/getCollections";
import getUsersList from "@/actions/admin/getUsersList";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";
import { toCollectionHostSummary } from "@/utils/collectionHosts";

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
      collectionHosts={collectionHosts?.map(toCollectionHostSummary)}
    >
      {children}
    </AdminSectionProvider>
  );
};

export default ProtectedAdminPageLayout;
