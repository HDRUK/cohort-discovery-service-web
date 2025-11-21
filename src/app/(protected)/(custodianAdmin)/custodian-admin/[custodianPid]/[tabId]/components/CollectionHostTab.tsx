import { Box, Skeleton } from "@mui/material";
import CollectionHostAdmin from "./CollectionHostAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";

export const CollectionHostsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionHostsTab = async ({
  custodianPid,
}: {
  custodianPid: string;
}) => {
  const { data: collectionHosts } = await getCollectionHosts(custodianPid);

  return (
    <CollectionHostAdmin pid={custodianPid} collectionHosts={collectionHosts} />
  );
};

export default CollectionHostsTab;
