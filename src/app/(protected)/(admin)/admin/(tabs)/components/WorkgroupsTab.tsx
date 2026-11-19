import WorkgroupsAdmin from "./WorkgroupsAdmin";
import { CollectionsSearchParams } from "@/types/api";
import { buildWorkgroupCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import { getAdminCollectionList } from "@/server/data/collections";
import { getWorkgroups } from "@/server/data/workgroups";
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
  searchParams: Promise<CollectionsSearchParams>;
}) => {
  const [
    { page = 1, per_page = DEFAULT_PER_PAGE, ...rest } = {},
    { data: workgroups },
  ] = await Promise.all([searchParams, getWorkgroups()]);

  const params = buildWorkgroupCollectionParams(
    { page, per_page, ...rest },
    workgroups ?? [],
  );
  const { data: collections } = await getAdminCollectionList({ params });

  return <WorkgroupsAdmin collections={collections} />;
};

export default WorkgroupsTab;
