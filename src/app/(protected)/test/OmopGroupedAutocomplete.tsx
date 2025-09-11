import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip, { type ChipProps } from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

// ---- Types ----
export type Domain =
  | "person"
  | "drug"
  | "condition"
  | "observation"
  | "measurement";

export type GroupLabel =
  | "PERSON"
  | "DRUG EXPOSURE"
  | "CONDITION"
  | "OBSERVATION"
  | "MEASUREMENT";

export interface OmopOption {
  id: string;
  label: string;
  group: GroupLabel;
  domain: Domain;
}

// ---- Sample OMOP-like options ----
const options: readonly OmopOption[] = [
  { id: "person-male", label: "male", group: "PERSON", domain: "person" },
  { id: "person-female", label: "female", group: "PERSON", domain: "person" },
  {
    id: "drug-az-covid-vax",
    label: "astrazenica covid vaccine",
    group: "DRUG EXPOSURE",
    domain: "drug",
  },
  {
    id: "drug-chadox-covid-vax",
    label: "chadox covid vacine",
    group: "DRUG EXPOSURE",
    domain: "drug",
  },
  {
    id: "cond-diabetes",
    label: "diabetes",
    group: "CONDITION",
    domain: "condition",
  },
  { id: "cond-ckd", label: "CKD", group: "CONDITION", domain: "condition" },
  {
    id: "cond-cancer",
    label: "cancer",
    group: "CONDITION",
    domain: "condition",
  },
  {
    id: "cond-hip-fracture",
    label: "hip fracture",
    group: "CONDITION",
    domain: "condition",
  },
  {
    id: "cond-wrist-fracture",
    label: "wrist fracture",
    group: "CONDITION",
    domain: "condition",
  },
  {
    id: "cond-forearm-fracture",
    label: "forearm fracture",
    group: "CONDITION",
    domain: "condition",
  },
  {
    id: "obs-smoker",
    label: "smoker",
    group: "OBSERVATION",
    domain: "observation",
  },
  {
    id: "obs-death",
    label: "death",
    group: "OBSERVATION",
    domain: "observation",
  },
  {
    id: "meas-iga-sarscov2",
    label: "IgA SARs-CoV-2 antibodies",
    group: "MEASUREMENT",
    domain: "measurement",
  },
  {
    id: "meas-igg-sarscov2",
    label: "IgG SARs-CoV-2 antibodies",
    group: "MEASUREMENT",
    domain: "measurement",
  },
] as const;

const chipColorByDomain = (domain: Domain): ChipProps["color"] => {
  switch (domain) {
    case "person":
      return "warning";
    case "drug":
      return "secondary";
    case "condition":
      return "primary";
    case "observation":
      return "info";
    case "measurement":
      return "success";
  }
};

const filter = createFilterOptions<OmopOption>({
  stringify: (option) => `${option.label} ${option.group} ${option.domain}`,
  matchFrom: "any",
});

const groupBy = (option: OmopOption): GroupLabel => option.group;
const getOptionLabel = (option: OmopOption): string => option.label;
const isOptionEqualToValue = (opt: OmopOption, val: OmopOption): boolean =>
  opt.id === val.id;

export default function OmopGroupedAutocomplete(): JSX.Element {
  const [value, setValue] = React.useState<OmopOption | null>(null);
  const [date, setDate] = React.useState<Dayjs | null>(null);

  const color = value ? `${chipColorByDomain(value.domain)}.main` : "black";
  const maxWidth = 600;

  return (
    <Box sx={{ maxWidth }}>
      <Box sx={{ backgroundColor: color, maxWidth: 200, minHeight: 50, p: 1 }}>
        <Typography variant="h4" sx={{ color: "#fff" }}>
          {value?.domain || "...."}
        </Typography>
      </Box>

      <Box
        sx={{
          minWidth: maxWidth,
          maxWidth,
          color,
          border: 4,
          borderColor: color,
          p: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Autocomplete<OmopOption, false, false, false>
            options={options}
            groupBy={groupBy}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            filterOptions={filter}
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            renderValue={(selected) =>
              selected ? (
                <Chip
                  key={selected.id}
                  label={selected.label}
                  color={chipColorByDomain(selected.domain)}
                />
              ) : null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="code"
                placeholder={value ? "" : "Type to search…"}
              />
            )}
            renderGroup={(params) => (
              <li key={params.key}>
                <Divider sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {params.group}
                  </Typography>
                </Divider>
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                  {params.children}
                </Box>
              </li>
            )}
            sx={{
              width: "100%",
              "& .MuiAutocomplete-groupLabel": { background: "transparent" },
            }}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: date
                    ? `Chosen: ${date.format("YYYY-MM-DD")}`
                    : " ",
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </Box>
  );
}
