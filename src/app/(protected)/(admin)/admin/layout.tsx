import { Suspense } from "react";
import { Paper } from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import { getCollectionHosts } from "@/server/data/collectionHosts";
import { getCollections } from "@/server/data/collections";
import { getUsersList } from "@/server/data/users";
import { AdminSectionProvider } from "@/contexts/AdminSectionContext";
import AdminGate from "./components/AdminGate";

const ProtectedAdminPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Suspense
    fallback={
      <Paper sx={{ display: "flex", height: "100%" }}>
        <SkeletonFull />
      </Paper>
    }
  >
    <AdminGate>
      <AdminSectionProvider
        users={getUsersList()}
        collections={getCollections()}
        collectionHosts={getCollectionHosts()}
      >
        {children}
      </AdminSectionProvider>
    </AdminGate>
  </Suspense>
);

export default ProtectedAdminPageLayout;
