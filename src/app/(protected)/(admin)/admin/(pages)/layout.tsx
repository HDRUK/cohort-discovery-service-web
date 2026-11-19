// Admin pages without a tab bar (configuration, regression, collection
// health). They only need the admin gate, so they don't wait for the tab
// lists' reads.
import { ReactNode, Suspense } from "react";
import { Paper } from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import AdminGate from "../components/AdminGate";

const AdminPagesLayout = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <Paper sx={{ display: "flex", height: "100%" }}>
        <SkeletonFull />
      </Paper>
    }
  >
    <AdminGate>{children}</AdminGate>
  </Suspense>
);

export default AdminPagesLayout;
