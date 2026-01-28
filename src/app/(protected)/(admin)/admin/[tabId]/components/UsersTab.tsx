import { Box, Skeleton } from "@mui/material";
import { isStandalone } from "@/utils/modes";
import { notFound } from "next/navigation";
// import CollectionHostAdmin from "./CollectionHostAdmin";
// import getCollectionHosts from "@/actions/getCollectionHosts";

export const UsersSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const UsersTab = async ({ applicationMode }: { applicationMode: string }) => {
  /*
  User management within the tool is not available yet. This functionality will be explored in future development. 
  For Integrrated mode, Cohort Discovery is managing users through an integrated external system. 
  Meanwhile, if you require a user-management utility within the tool, please contact us at gateway@hdruk.ac.uk.’
  Or contact us through github via raising an issue.
  */

  if (!isStandalone(applicationMode)) notFound();

  // const { data: collectionHosts } = await getCollectionHosts(custodianPid);

  return (
    <UsersSkeleton />
    // <CollectionHostAdmin pid={custodianPid} collectionHosts={collectionHosts} />
  );
};

export default UsersTab;
