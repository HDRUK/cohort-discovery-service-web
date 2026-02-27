import getCollectionHosts from "@/actions/collectionHost/getCollectionHosts";
import getAdminWorkgroups from "@/actions/workgroup/getAdminWorkgroups";
import getCollections from "@/actions/collection/getCollections";
import getUsersList from "@/actions/admin/getUsersList";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";

const ProtectedAdminPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: collectionHosts } = await getCollectionHosts();
  const { data: workgroups } = await getAdminWorkgroups();
  const { data: collections } = await getCollections();
  const { data: users } = await getUsersList();

  return (
    <AdminSectionProvider
      users={users}
      collections={collections}
      collectionHosts={collectionHosts}
      workgroups={workgroups}
    >
      {children}
    </AdminSectionProvider>
  );
};

export default ProtectedAdminPageLayout;
