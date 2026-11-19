import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { CollectionsSearchParams } from "@/types/api";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import NetworksTab from "../components/NetworksTab";

const AdminNetworksPage = ({
  searchParams,
}: {
  searchParams: Promise<CollectionsSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<CollectionsSkeleton />}>
      <NetworksTab searchParams={searchParams} />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminNetworksPage;
