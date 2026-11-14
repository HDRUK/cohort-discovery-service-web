import { Box, Skeleton } from "@mui/material";
import NetworksAdmin from "./NetworksAdmin";
import { getNetworks } from "@/server/data/networks";

export const NetworksSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const NetworksTab = async () => {
  const { data: networks } = await getNetworks();

  return <NetworksAdmin networks={networks} />;
};

export default NetworksTab;
