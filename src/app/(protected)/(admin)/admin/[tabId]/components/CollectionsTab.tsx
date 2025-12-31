import CollectionsAdmin from "./CollectionsAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import getAdminCollections from "@/actions/getAdminCollections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCustodians from "@/actions/getCustodians";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async ({
  searchParams,
}: {
  searchParams: CollectionsSearchParams;
}) => {
  const params = buildCollectionParams(searchParams);

  const [
    { data: collectionHosts },
    { data: custodianCollections },
    { data: custodians },
  ] = await Promise.all([
    getCollectionHosts(),
    getAdminCollections({ params }),
    getCustodians(),
  ]);

  return (
    <CollectionsAdmin
      collectionHosts={collectionHosts}
      collections={custodianCollections}
      custodians={custodians}
    />
  );
};

export default CollectionsTab;
