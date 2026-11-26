import { Suspense } from "react";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { CollectionsSearchParams } from "@/types/api";
import WorkgroupsTab from "../components/WorkgroupsTab";
import WorkgroupsAdmin from "../components/WorkgroupsAdmin";

const AdminWorkgroupsPage = ({
  searchParams,
}: {
  searchParams: Promise<CollectionsSearchParams>;
}) => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<WorkgroupsAdmin />}>
      <WorkgroupsTab searchParams={searchParams} />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminWorkgroupsPage;
