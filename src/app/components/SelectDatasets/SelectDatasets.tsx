"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import { Collection } from "@/types/api";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Checkbox,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useRef } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setSelectedDatasets(initialSelection ?? []);
  }, [initialSelection, setSelectedDatasets]);

  const options = collections.map((c) => ({ value: c.pid, label: c.name }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Autocomplete
        multiple
        disableCloseOnSelect
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
                color="secondary"
              />
            ))}
          </Box>
        )}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li
              key={key}
              {...rest}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: selected ? "rgba(0,0,0,0.04)" : "transparent",
              }}
            >
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.3 }}>
                {option.label}
              </Typography>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select datasets" size="small" />
        )}
        sx={{ minWidth: 400 }}
      />
    </Box>
  );
};

export default SelectDatasets;
