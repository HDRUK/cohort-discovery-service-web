import CollectionsAdmin from "./CollectionsAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import getCustodianCollections from "@/actions/getCustodianCollections";
import { ApiSearchParams } from "@/types/api";
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
  searchParams: ApiSearchParams;
}) => {
  const { page, per_page } = searchParams;
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page.toString());
  }
  if (per_page) {
    params.append("per_page", per_page.toString());
  }

  const [{ data: collectionHosts }, { data: custodianCollections }] =
    await Promise.all([
      getCollectionHosts(custodianPid),
      getCustodianCollections(custodianPid, params),
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
