import { Suspense } from "react";
import { Paper } from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import CustodianSection from "./components/CustodianSection";

const ProtectedCustodianPageLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ custodianPid: string }>;
}) => (
  <Suspense
    fallback={
      <Paper sx={{ display: "flex", height: "100%" }}>
        <SkeletonFull />
      </Paper>
    }
  >
    <CustodianSection params={params}>{children}</CustodianSection>
  </Suspense>
);

export default ProtectedCustodianPageLayout;
