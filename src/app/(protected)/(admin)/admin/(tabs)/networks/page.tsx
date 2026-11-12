import { Suspense } from "react";
import { CollectionsSearchParams } from "@/types/api";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import NetworksTab from "../components/NetworksTab";

const AdminNetworksPage = ({
  searchParams,
}: {
  searchParams: Promise<CollectionsSearchParams>;
}) => (
  <Suspense fallback={<CollectionsSkeleton />}>
    <NetworksTab searchParams={searchParams} />
  </Suspense>
);

export default AdminNetworksPage;
