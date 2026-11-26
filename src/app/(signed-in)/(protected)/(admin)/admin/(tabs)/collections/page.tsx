import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { CollectionsSearchParams } from "@/types/api";
import CollectionsTab from "@/modules/CollectionsTab/CollectionsTab";
import CollectionsManagement from "@/modules/CollectionsManagement";

const AdminCollectionsPage = ({
  searchParams,
}: {
  searchParams: Promise<CollectionsSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<CollectionsManagement isAdmin />}>
      <CollectionsTab searchParams={searchParams} />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminCollectionsPage;
