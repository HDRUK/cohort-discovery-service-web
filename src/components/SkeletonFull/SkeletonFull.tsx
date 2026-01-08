import { Skeleton, SkeletonProps } from "@mui/material";

const SkeletonFull = ({ sx }: { sx?: SkeletonProps["sx"] }) => (
  <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: "100%", ...sx }} />
);

export default SkeletonFull;
