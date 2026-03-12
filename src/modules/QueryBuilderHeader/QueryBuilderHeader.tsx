"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Stack } from "@mui/material";
import useHasMounted from "@/hooks/useHasMounted";
import FilterDatasets from "@/components/FilterDatasets";
import CohortQueryTitle from "@/components/CohortQueryTitle";

export const filterDatasetChipSx = {
  borderRadius: 10,
  height: 30,
  minWidth: 100,
};

const QueryBuilderHeader = () => {
  const hasMounted = useHasMounted();
  const { selectedDatasets, open, setOpen, setPreviouslySelectedDatasets } =
    useQueryBuilder((qb) => ({
      selectedDatasets: qb.selectedDatasets,
      open: qb.openSelectDatasetsPanel,
      setOpen: qb.setOpenSelectDatasetsPanel,
      setPreviouslySelectedDatasets: qb.setPreviouslySelectedDatasets,
    }));

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <CohortQueryTitle />

        <FilterDatasets />
      </Stack>
      {/*<SelectDatasets
        initialSelection={initialSelection}
        collections={collections.data}
      />*/}
    </>
  );
};

export default QueryBuilderHeader;
