"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { Chip, Box, Tooltip, Typography } from "@mui/material";
import Title from "../Title";
import { DatasetErrors } from "@/utils/datasets";

const FilterDatasets = () => {
  const { selectedDatasets, open, setOpen } = useQueryBuilder((qb) => ({
    selectedDatasets: qb.selectedDatasets,
    open: qb.openSelectDatasetsPanel,
    setOpen: qb.setOpenSelectDatasetsPanel,
  }));

  const noDatasets = selectedDatasets.length === 0;

  return (
    <Title title="Filter" subTitle="Collections">
      <Tooltip title={DatasetErrors.NO_DATASETS} variant="error">
        <Chip
          variant={noDatasets ? "outlined" : "filled"}
          color={noDatasets ? "error" : undefined}
          onClick={() => setOpen(!open)}
          sx={{
            bgcolor: open && !noDatasets ? "secondary.main" : "white",
            color: open && !noDatasets ? "secondary.contrastText" : "inherit",
            borderRadius: 10,
            height: 30,
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
                label={selectedDatasets.length}
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
