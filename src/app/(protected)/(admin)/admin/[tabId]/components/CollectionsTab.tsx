import { Box, Skeleton } from "@mui/material";
import CollectionsAdmin from "./CollectionsAdmin";
import getAdminCollections from "@/actions/getAdminCollections";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";

export const CollectionsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const CollectionsTab = async () => {
  const { data: collections } = await getAdminCollections();

  return <CollectionsAdmin collections={collections} />;
};

export default CollectionsTab;
