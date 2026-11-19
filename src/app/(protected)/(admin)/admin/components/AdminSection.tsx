import { ReactNode } from "react";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";
import { getCollectionHosts } from "@/server/data/collectionHosts";
import { getCollections } from "@/server/data/collections";
import { getUsersList } from "@/server/data/users";

const AdminSection = ({ children }: { children: ReactNode }) => (
  <AdminSectionProvider
    users={getUsersList()}
    collections={getCollections()}
    collectionHosts={getCollectionHosts()}
  >
    {children}
  </AdminSectionProvider>
);

export default AdminSection;
