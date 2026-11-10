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
