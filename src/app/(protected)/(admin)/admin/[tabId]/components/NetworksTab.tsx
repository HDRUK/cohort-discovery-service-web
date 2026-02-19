import { CollectionsSearchParams } from "@/types/api";
import { buildCollectionParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import { DEFAULT_PER_PAGE } from "@/config/defaults";
import NetworksAdmin from "./NetworksAdmin";
import getNetworks from "@/actions/getNetworks";

export const WorkgroupsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const NetworksTab = async ({
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

  const { data: networks } = await getNetworks({ params });

  return <NetworksAdmin networks={networks} />;
};

export default NetworksTab;
