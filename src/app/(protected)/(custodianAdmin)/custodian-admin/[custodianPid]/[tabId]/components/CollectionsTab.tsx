import CollectionsAdmin from "./CollectionsAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import getCustodianCollections from "@/actions/getCustodianCollections";
import { Box, Skeleton } from "@mui/material";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async ({ custodianPid }: { custodianPid: string }) => {
  const [{ data: collectionHosts }, { data: custodianCollections }] =
    await Promise.all([
      getCollectionHosts(custodianPid),
      getCustodianCollections(custodianPid),
    ]);

  return (
    <CollectionsAdmin
      pid={custodianPid}
      collectionHosts={collectionHosts}
      collections={custodianCollections}
    />
  );
};

export default CollectionsTab;
