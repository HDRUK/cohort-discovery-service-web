import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { CollectionsSearchParams } from "@/types/api";
import CollectionsTab from "@/modules/CollectionsTab/CollectionsTab";
import CollectionsManagement from "@/modules/CollectionsManagement";

const CustodianCollectionsPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ custodianPid: string }>;
  searchParams: Promise<CollectionsSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<CollectionsManagement isAdmin={false} />}>
      <CollectionsTab
        custodianPid={params.then(({ custodianPid }) => custodianPid)}
        searchParams={searchParams}
      />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default CustodianCollectionsPage;
