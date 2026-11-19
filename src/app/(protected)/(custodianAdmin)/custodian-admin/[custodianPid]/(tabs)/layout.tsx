// Custodian routes with the tab bar; [custodianPid]/page.tsx only redirects
// to a tab, so it stays outside. The bar needs the pid, so it can't be
// prerendered; the gate and section reads sit in a Suspense inside it.
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
