import { ReactNode } from "react";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";
import { getAccessPolicy } from "@/server/data/accessPolicy";
import { getCollectionHosts } from "@/server/data/collectionHosts";
import { getCollections } from "@/server/data/collections";
import { getFeatureOverrides } from "@/server/data/features";
import { getUsersList } from "@/server/data/users";
import { getWorkgroups } from "@/server/data/workgroups";

const AdminSection = ({ children }: { children: ReactNode }) => (
  <AdminSectionProvider
    users={getUsersList()}
    collections={getCollections()}
    collectionHosts={getCollectionHosts()}
    accessPolicy={getAccessPolicy()}
    workgroups={getWorkgroups()}
    featureOverrides={getFeatureOverrides()}
  >
    {children}
  </AdminSectionProvider>
);

export default AdminSection;
