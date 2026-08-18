import getAdminCollections from "@/actions/collection/getAdminCollections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCustodianCollections from "@/actions/collection/getCustodianCollections";
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
  collectionsPromise,
}: {
  searchParams: CollectionsSearchParams;
  custodianPid?: string;
  collectionsPromise?: ReturnType<typeof getAdminCollections>;
}) => {
  const params = buildCollectionParams(searchParams);

  const isAdmin = !custodianPid;

  const { data: collections } = await (collectionsPromise ??
    (isAdmin
      ? getAdminCollections({ params })
      : getCustodianCollections(custodianPid, { params })));

  return <CollectionsManagement isAdmin={isAdmin} collections={collections} />;
};

export default CollectionsTab;
