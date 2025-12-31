"use client";

import { Box, Skeleton } from "@mui/material";
import Title from "../Title";
import { filterDatasetChipSx } from "./FilterDatasets";

const FilterDatasetsSkeleton = () => {
  return (
    <Title title="Filter" subTitle="Collections">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="rounded"
          sx={{
            ...filterDatasetChipSx,
          }}
        />
      </Box>
    </Title>
  );
};

export default FilterDatasetsSkeleton;
