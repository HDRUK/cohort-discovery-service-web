"use client";

import { FormControlLabel, Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Collection } from "@/types/api";
import { useUserDataStore } from "@/hooks/userDataStore";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useFeatures from "@/hooks/useFeatures";
import { addPids, removePids } from "@/utils/collections";
import SquareCheckbox from "../SquareCheckbox";
import Title from "../Title";

type CollectionTypeFilter = {
  key: string;
  label: string;
  predicate: (collection: Collection) => boolean;
  feature?: "queryBuilderUseDeath" | "queryBuilderUseLocation";
};

const COLLECTION_TYPE_FILTERS: CollectionTypeFilter[] = [
  {
    key: "synthetic",
    label: "synthetic",
    predicate: (c) => !!c.is_synthetic,
  },
  {
    key: "death",
    label: "includes death data",
    predicate: (c) => !!c.death_enabled,
    feature: "queryBuilderUseDeath",
  },
  {
    key: "location",
    label: "includes location data",
    predicate: (c) => !!c.location_enabled,
    feature: "queryBuilderUseLocation",
  },
];

const CollectionTypeFilters = () => {
  const collections = useUserDataStore((s) => s.userCollections);
  const selectedDatasets = useQueryBuilder((qb) => qb.selectedDatasets);
  const setSelectedDatasets = useQueryBuilder((qb) => qb.setSelectedDatasets);

  const features = useFeatures();

  const selectedSet = useMemo(
    () => new Set(selectedDatasets),
    [selectedDatasets],
  );

  const filters = useMemo(() => {
    return COLLECTION_TYPE_FILTERS.filter(
      ({ feature }) => !feature || features[feature],
    ).map(({ key, label, predicate }) => {
      const pids = collections.filter(predicate).map((c) => c.pid);
      const nSelected = pids.filter((pid) => selectedSet.has(pid)).length;

      return {
        key,
        label,
        pids,
        checked: pids.length > 0 && nSelected === pids.length,
        indeterminate: nSelected > 0 && nSelected < pids.length,
        disabled: pids.length === 0,
      };
    });
  }, [collections, selectedSet, features]);

  const handleToggle = useCallback(
    (pids: string[], allSelected: boolean) => {
      const next = allSelected
        ? removePids(selectedDatasets, new Set(pids))
        : addPids(selectedDatasets, pids);

      setSelectedDatasets(next);
    },
    [selectedDatasets, setSelectedDatasets],
  );

  return (
    <Stack
      direction="row"
      gap={2}
      padding={2}
      sx={{ flexWrap: "wrap", alignItems: "center" }}
    >
      <Title title={"Collection Type"} />
      {filters.map(({ key, label, pids, checked, indeterminate, disabled }) => (
        <FormControlLabel
          key={key}
          sx={{ ml: 0, mr: 0 }}
          control={
            <SquareCheckbox
              data-testid={`collection-type-${key}`}
              slotProps={{ input: { "aria-label": label } }}
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              onChange={() => handleToggle(pids, checked)}
              sx={{ p: 0, mr: 1 }}
            />
          }
          label={label}
        />
      ))}
    </Stack>
  );
};

export default CollectionTypeFilters;
