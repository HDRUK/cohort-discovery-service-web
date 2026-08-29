import { Skeleton, Stack } from "@mui/material";

interface TableSkeletonProps {
  rows?: number;
}

/**
 * A generic table-shaped loading skeleton: a header bar followed by row bars.
 * Use as a <Suspense fallback> for pages that stream a <Table> of data.
 */
const TableSkeleton = ({ rows = 6 }: TableSkeletonProps) => (
  <Stack spacing={1} sx={{ width: "100%" }}>
    <Skeleton variant="rectangular" height={44} />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={36} />
    ))}
  </Stack>
);

export default TableSkeleton;
