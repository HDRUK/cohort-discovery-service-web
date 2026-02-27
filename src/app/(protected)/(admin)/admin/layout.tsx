import getCollectionHosts from "@/actions/collectionHost/getCollectionHosts";
import AdminPage from "./components/AdminPage";
import getAdminWorkgroups from "@/actions/workgroup/getAdminWorkgroups";
import getCollections from "@/actions/collection/getCollections";
import getUsersList from "@/actions/admin/getUsersList";

const ProtectedAdminPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: allCollectionHosts } = await getCollectionHosts();
  const { data: allWorkgroups } = await getAdminWorkgroups();
  const { data: allCollections } = await getCollections();
  const { data: users } = await getUsersList();

  return (
    <AdminPage
      users={users}
      collections={allCollections}
      collectionHosts={allCollectionHosts}
      workgroups={allWorkgroups}
    >
      {children}
    </AdminPage>
  );
};

export default ProtectedAdminPageLayout;
