"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Skeleton, Box, Typography } from "@mui/material";

const CollectionHeader = ({ pid }: { pid: string }) => {
  const {
    custodianData: { custodians },
  } = useDaphneStore();

  const custodian = custodians.find((c) => c.pid === pid);
  if (!custodian) return <Skeleton height={"100%"} />;
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h3">
        {custodian.name} ({custodian.pid})
      </Typography>
    </Box>
  );
};

export default CollectionHeader;
