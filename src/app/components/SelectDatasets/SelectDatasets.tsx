"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Collection } from "@/types/api";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";
import { useEffect } from "react";

const SelectDatasets = ({
  initialSelection,
  collections,
}: {
  initialSelection: string[];
  collections: Collection[];
}) => {
  const {
    queryBuilder: { selectedDatasets, setSelectedDatasets },
  } = useDaphneStore();

  useEffect(() => {
    setSelectedDatasets(initialSelection);
  }, [initialSelection, setSelectedDatasets]);

  const options = collections.map((c) => ({ value: c.pid, label: c.name }));

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
    >
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        value={options.filter((option) =>
          selectedDatasets.includes(option.value)
        )}
        onChange={(_, newValue) =>
          setSelectedDatasets(newValue.map((v) => v.value))
        }
        renderValue={(selected, getTagProps) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={option.label}
                color="primary"
              />
            ))}
          </Box>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select datasets" size="small" />
        )}
        sx={{ minWidth: 400 }}
      />
    </Box>
  );
};

export default SelectDatasets;
