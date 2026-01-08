"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { Chip, Box, Tooltip, Typography } from "@mui/material";
import Title from "../Title";
import { DatasetErrors } from "@/utils/datasets";
import FilterDatasetsSkeleton from "./FilterDatasetsSkeleton";
import useHasMounted from "@/hooks/useHasMounted";

export const filterDatasetChipSx = {
  borderRadius: 10,
  height: 30,
  minWidth: 100,
};

const FilterDatasets = () => {
  const hasMounted = useHasMounted();
  const { selectedDatasets, open, setOpen } = useQueryBuilder((qb) => ({
    selectedDatasets: qb.selectedDatasets,
    open: qb.openSelectDatasetsPanel,
    setOpen: qb.setOpenSelectDatasetsPanel,
  }));

  const noDatasets = selectedDatasets?.length === 0;

  if (!hasMounted) {
    return <FilterDatasetsSkeleton />;
  }

  return (
    <Title title="Filter" subTitle="Collections">
      <Tooltip
        title={noDatasets ? DatasetErrors.NO_DATASETS : undefined}
        variant="error"
      >
        <Chip
          variant={noDatasets ? "outlined" : "filled"}
          color={noDatasets ? "error" : undefined}
          onClick={() => setOpen(!open)}
          sx={{
            bgcolor: open && !noDatasets ? "secondary.main" : "white",
            color: open && !noDatasets ? "secondary.contrastText" : "inherit",
            ...filterDatasetChipSx,
          }}
          label={
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "baseline",
                flexWrap: "nowrap",
              }}
            >
              <Chip
                label={selectedDatasets?.length ?? 0}
                sx={{
                  bgcolor: noDatasets ? "error.main" : "background.default",
                  color: noDatasets
                    ? "error.contrastText"
                    : "background.contrastText",
                  borderRadius: 10,
                  mr: 0.5,
                }}
              />
              <Typography
                variant="body1"
                color={noDatasets ? "error" : "inherit"}
              >
                Selected
              </Typography>
            </Box>
          }
        />
      </Tooltip>
    </Title>
  );
};

export default FilterDatasets;
