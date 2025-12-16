import CollectionsCustodianAdmin from "./CollectionsCustodianAdmin";
import getCustodianCollectionHosts from "@/actions/getCustodianCollectionHosts";
import getCustodianCollections from "@/actions/getCustodianCollections";
import { ApiSearchParams } from "@/types/api";
import { buildSearchParams } from "@/utils/params";
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
  searchParams: ApiSearchParams & {
    collection_filter?: string;
    search_collection?: string;
  };
}) => {
  const { page, per_page, collection_filter, search_collection } =
    searchParams ?? {};
  const queryParams = {
    page,
    per_page,
    state: collection_filter,
    ["name[]"]: search_collection,
  };

  const params = buildSearchParams(queryParams);

  const [{ data: collectionHosts }, { data: custodianCollections }] =
    await Promise.all([
      getCustodianCollectionHosts(custodianPid),
      getCustodianCollections(custodianPid, params),
    ]);

  return (
    <CollectionsCustodianAdmin
      pid={custodianPid}
      collectionHosts={collectionHosts}
      collections={custodianCollections}
    />
  );
};

export default CollectionsTab;
