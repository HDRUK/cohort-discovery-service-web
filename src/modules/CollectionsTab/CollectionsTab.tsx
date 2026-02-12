import getAdminCollections from "@/actions/getAdminCollections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCustodianCollections from "@/actions/getCustodianCollections";
import CollectionsManagement from "../CollectionsManagement";

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

  const [{ data: collections }] = await Promise.all([
    isAdmin
      ? getAdminCollections({ params })
      : getCustodianCollections(custodianPid, { params }),
  ]);

  return <CollectionsManagement isAdmin={isAdmin} collections={collections} />;
};

export default CollectionsTab;
