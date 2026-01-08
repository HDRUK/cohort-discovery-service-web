import getAdminWorkgroups from "@/actions/getAdminWorkgroups";
import CollectionsCustodianAdmin from "./CollectionsCustodianAdmin";
import getCustodianCollectionHosts from "@/actions/getCustodianCollectionHosts";
import getCustodianCollections from "@/actions/getCustodianCollections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async ({
  custodianPid,
  searchParams,
}: {
  custodianPid: string;
  searchParams: CollectionsSearchParams;
}) => {
  const params = buildCollectionParams(searchParams);

  const [
    { data: collectionHosts },
    { data: custodianCollections },
    { data: workgroups },
  ] = await Promise.all([
    getCustodianCollectionHosts(custodianPid),
    getCustodianCollections(custodianPid, { params }),
    getAdminWorkgroups(),
  ]);

  return (
    <CollectionsCustodianAdmin
      pid={custodianPid}
      collectionHosts={collectionHosts}
      collections={custodianCollections}
      workgroups={workgroups}
    />
  );
};

export default CollectionsTab;
