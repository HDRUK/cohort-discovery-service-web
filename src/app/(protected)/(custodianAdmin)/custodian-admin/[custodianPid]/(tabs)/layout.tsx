import { ReactNode, Suspense } from "react";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import CustodianSection from "../components/CustodianSection";
import CustodianTabs from "./components/CustodianTabs";

const CustodianTabsLayout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ custodianPid: string }>;
}) => (
  <Suspense fallback={<CollectionsSkeleton />}>
    <CustodianTabs>
      <Suspense fallback={<CollectionsSkeleton />}>
        <CustodianSection params={params}>{children}</CustodianSection>
      </Suspense>
    </CustodianTabs>
  </Suspense>
);

export default CustodianTabsLayout;
