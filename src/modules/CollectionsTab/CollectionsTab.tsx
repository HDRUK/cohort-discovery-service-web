import CollectionsAdmin from "@/modules/CollectionsAdmin/CollectionsAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import getAdminCollections from "@/actions/getAdminCollections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCustodians from "@/actions/getCustodians";
import getAdminWorkgroups from "@/actions/getAdminWorkgroups";
import getCustodianCollections from "@/actions/getCustodianCollections";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async ({
  searchParams,
  custodianPid,
}: {
  searchParams: CollectionsSearchParams;
  custodianPid?: string;
}) => {
  const params = buildCollectionParams(searchParams);

  const isAdmin = !custodianPid;

  const [
    { data: collectionHosts },
    { data: custodianCollections },
    { data: custodians },
    { data: workgroups },
  ] = await Promise.all([
    getCollectionHosts(),
    isAdmin
      ? getAdminCollections({ params })
      : getCustodianCollections(custodianPid, { params }),
    isAdmin ? getCustodians() : Promise.resolve({ data: undefined }),
    getAdminWorkgroups(),
  ]);

  return (
    <CollectionsAdmin
      admin={isAdmin}
      collectionHosts={collectionHosts}
      collections={custodianCollections}
      custodians={custodians}
      workgroups={workgroups}
    />
  );
};

export default CollectionsTab;
