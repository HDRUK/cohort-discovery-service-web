"use client";

import { Box, Stack } from "@mui/material";
import FilterDatasets from "@/components/FilterDatasets";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import SelectDatasets from "@/components/SelectDatasets";
import useQueryBuilder from "@/hooks/useQueryBuilder";

export const filterDatasetChipSx = {
  borderRadius: 10,
  height: 30,
  minWidth: 100,
};

const QueryBuilderHeader = () => {
  const open = useQueryBuilder((qb) => qb.openSelectDatasetsPanel);
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        {open ? <Box /> : <CohortQueryTitle />}

        <FilterDatasets />
      </Stack>
      <SelectDatasets />
    </>
  );
};

export default QueryBuilderHeader;
