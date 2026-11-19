import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { ApiSearchParams } from "@/types/api";
import CollectionHostsTab, {
  CollectionHostsSkeleton,
} from "../components/CollectionHostTab";

const CustodianHostsPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ custodianPid: string }>;
  searchParams: Promise<ApiSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<CollectionHostsSkeleton />}>
      <CollectionHostsTab
        custodianPid={params.then(({ custodianPid }) => custodianPid)}
        searchParams={searchParams}
      />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default CustodianHostsPage;
