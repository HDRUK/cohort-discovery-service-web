import { Box, Skeleton } from "@mui/material";
import CollectionHostAdmin from "./CollectionHostAdmin";
import { getCustodianCollectionHosts } from "@/server/data/collectionHosts";
import { ApiSearchParams } from "@/types/api";
import { buildCollectionHostParams } from "@/utils/params";

export const CollectionHostsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionHostsTab = async ({
  custodianPid: custodianPidPromise,
  searchParams,
}: {
  custodianPid: Promise<string>;
  searchParams: Promise<ApiSearchParams>;
}) => {
  const [custodianPid, resolvedSearchParams] = await Promise.all([
    custodianPidPromise,
    searchParams,
  ]);
  const params = buildCollectionHostParams(resolvedSearchParams);
  const { data: collectionHosts } = await getCustodianCollectionHosts(
    custodianPid,
    { params },
  );

  return (
    <CollectionHostAdmin pid={custodianPid} collectionHosts={collectionHosts} />
  );
};

export default CollectionHostsTab;
