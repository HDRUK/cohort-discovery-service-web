import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { NetworkCustodiansSearchParams } from "@/types/api";
import NetworksTab from "../components/NetworksTab";
import NetworksAdmin from "../components/NetworksAdmin";

const AdminNetworksPage = ({
  searchParams,
}: {
  searchParams: Promise<NetworkCustodiansSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<NetworksAdmin />}>
      <NetworksTab searchParams={searchParams} />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminNetworksPage;
