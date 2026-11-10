import { Suspense } from "react";
import { Paper } from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import AdminGate from "./components/AdminGate";
import AdminSection from "./components/AdminSection";

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
      <AdminSection>{children}</AdminSection>
    </AdminGate>
  </Suspense>
);

export default ProtectedAdminPageLayout;
