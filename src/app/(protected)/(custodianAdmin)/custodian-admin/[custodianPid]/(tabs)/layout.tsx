import { ReactNode, Suspense } from "react";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import CustodianTabs from "./components/CustodianTabs";

const CustodianTabsLayout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ custodianPid: string }>;
}) => (
  <Suspense fallback={<CollectionsSkeleton />}>
    <CustodianTabs params={params}>{children}</CustodianTabs>
  </Suspense>
);

export default CustodianTabsLayout;
