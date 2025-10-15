import { Box, Skeleton } from "@mui/material";

export const RuleBoardSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" height={100} width="100%" sx={{ mb: 2 }} />
  </Box>
);
