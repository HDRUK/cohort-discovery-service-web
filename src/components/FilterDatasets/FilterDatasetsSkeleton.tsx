"use client";

import { Box, Skeleton } from "@mui/material";
import Title from "../Title";

const FilterDatasetsSkeleton = () => {
  return (
    <Title title="Filter" subTitle="Collections">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="rounded"
          sx={{
            borderRadius: 10,
            height: 30,
            width: 100,
          }}
        />
      </Box>
    </Title>
  );
};

export default FilterDatasetsSkeleton;
