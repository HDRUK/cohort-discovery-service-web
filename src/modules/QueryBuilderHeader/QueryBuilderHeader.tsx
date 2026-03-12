"use client";

import { Box, Stack } from "@mui/material";
import FilterDatasets from "@/components/FilterDatasets";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import SelectDatasets from "@/components/SelectDatasets";
import useQueryBuilder from "@/hooks/useQueryBuilder";

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
