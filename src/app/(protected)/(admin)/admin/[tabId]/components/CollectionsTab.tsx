import CollectionsAdmin from "./CollectionsAdmin";
import getCollectionHosts from "@/actions/getCollectionHosts";
import getAdminCollections from "@/actions/getAdminCollections";
import { ApiSearchParams } from "@/types/api";
import { buildSearchParams } from "@/utils/params";
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

  const [
    { data: collectionHosts },
    { data: custodianCollections },
    { data: custodians },
  ] = await Promise.all([
    getCollectionHosts(),
    getAdminCollections(params),
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
