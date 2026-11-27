import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { ApiSearchParams } from "@/types/api";
import NetworksTab, { NetworksSkeleton } from "../components/NetworksTab";

const AdminNetworksPage = ({
  searchParams,
}: {
  searchParams: Promise<ApiSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<NetworksSkeleton />}>
      <NetworksTab searchParams={searchParams} />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminNetworksPage;
