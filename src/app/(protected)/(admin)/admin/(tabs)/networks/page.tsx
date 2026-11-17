import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import NetworksTab, { NetworksSkeleton } from "../components/NetworksTab";

const AdminNetworksPage = () => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<NetworksSkeleton />}>
      <NetworksTab />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminNetworksPage;
