import WorkgroupsAdmin from "./WorkgroupsAdmin";
import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getAdminCollections from "@/actions/collection/getAdminCollections";
import { DEFAULT_PER_PAGE } from "@/config/defaults";

export const WorkgroupsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const WorkgroupsTab = async ({
  searchParams,
}: {
  searchParams: CollectionsSearchParams;
}) => {
  const { page = 1, per_page = DEFAULT_PER_PAGE, ...rest } = searchParams ?? {};

  const params = buildCollectionParams({
    page,
    per_page,
    ...rest,
  });

  const { data: collections } = await getAdminCollections({ params });

  return <WorkgroupsAdmin collections={collections} />;
};

export default WorkgroupsTab;
