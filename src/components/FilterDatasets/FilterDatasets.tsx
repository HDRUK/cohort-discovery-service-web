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
    <Box sx={{ display: "flex", my: 2 }}>
      <Title title="Filter" subTitle="Collections">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            minHeight: 30,
          }}
        >
          <Chip
            onClick={() => setOpen(!open)}
            sx={{
              bgcolor: open ? "secondary.main" : "white",
              color: open ? "secondary.contrastText" : "inherit",
              p: 1,
              borderRadius: 10,
              height: 40,
              fontSize: "1rem",
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
                    bgcolor: "white",
                    borderRadius: 10,
                    fontSize: "1rem",
                    mx: 1,
                  }}
                />
                Selected
              </Box>
            }
          />
        </Box>
      </Title>
    </Box>
  );
};

export default FilterDatasets;
