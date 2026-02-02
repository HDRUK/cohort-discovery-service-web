import getCollectionHosts from "@/actions/getCollectionHosts";
import AdminPage from "./components/AdminPage";
import getAdminWorkgroups from "@/actions/getAdminWorkgroups";
import getCollections from "@/actions/getCollections";

const ProtectedAdminPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: allCollectionHosts } = await getCollectionHosts();
  const { data: allWorkgroups } = await getAdminWorkgroups();
  const { data: allCollections } = await getCollections();

  return (
    <AdminPage
      collections={allCollections}
      collectionHosts={allCollectionHosts}
      workgroups={allWorkgroups}
    >
      {children}
    </AdminPage>
  );
};

export default ProtectedAdminPageLayout;
