import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import NetworksTab from "../components/NetworksTab";

const AdminNetworksPage = () => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<CollectionsSkeleton />}>
      <NetworksTab />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminNetworksPage;
