"use client";

import useQueryBuilder from "@/store/useQueryBuilder";
import { Chip, Box } from "@mui/material";
import Title from "../Title";

const FilterDatasets = () => {
  const { selectedDatasets, open, setOpen } = useQueryBuilder((qb) => ({
    selectedDatasets: qb.selectedDatasets,
    open: qb.openSelectDatasetsPanel,
    setOpen: qb.setOpenSelectDatasetsPanel,
  }));

  return (
    <Title title="Filter" subTitle="Collections">
      <Chip
        onClick={() => setOpen(!open)}
        sx={{
          bgcolor: open ? "secondary.main" : "white",
          color: open ? "secondary.contrastText" : "inherit",
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
                bgcolor: "background.default",
                borderRadius: 10,
                mr: 1,
              }}
            />
            Selected
          </Box>
        }
      />
    </Title>
  );
};

export default FilterDatasets;
