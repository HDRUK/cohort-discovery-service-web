import {
  getAdminCollectionList,
  getCustodianCollections,
} from "@/server/data/collections";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import CollectionsManagement from "../CollectionsManagement";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async ({
  searchParams,
  custodianPid: custodianPidPromise,
}: {
  searchParams: Promise<CollectionsSearchParams>;
  custodianPid?: Promise<string>;
}) => {
  const params = buildCollectionParams(await searchParams);
  const custodianPid = await custodianPidPromise;

  const isAdmin = !custodianPid;

  const { data: collections } = isAdmin
    ? await getAdminCollectionList({ params })
    : await getCustodianCollections(custodianPid, { params });

  return <CollectionsManagement isAdmin={isAdmin} collections={collections} />;
};

export default CollectionsTab;
