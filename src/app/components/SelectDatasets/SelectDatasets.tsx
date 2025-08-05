import { useDaphneStore } from "@/store/useDaphneStore";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";

type SelectDatasetsProps = {
  selectedDatasets: string[];
  setSelectedDatasets: (datasets: string[]) => void;
};

const SelectDatasets = ({
  selectedDatasets,
  setSelectedDatasets,
}: SelectDatasetsProps) => {
  const { collections } = useDaphneStore();
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
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((option) => (
              <Chip key={option.value} label={option.label} color="secondary" />
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
