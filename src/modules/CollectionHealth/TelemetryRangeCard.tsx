"use client";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import SectionCard from "@/components/SectionCard";
import { getDatetime } from "@/utils/date";
import { BIN_UNIT_OPTIONS, BinUnit } from "./timeRange";
import { TelemetryRange } from "./useTelemetryRange";

interface TelemetryRangeCardProps {
  telemetry: TelemetryRange;
  hint?: string;
}

const TelemetryRangeCard = ({ telemetry, hint }: TelemetryRangeCardProps) => {
  const {
    binDraft,
    range,
    handleReset,
    handleBinValueChange,
    handleBinUnitChange,
    handleFromChange,
    handleToChange,
  } = telemetry;

  return (
    <SectionCard
      title="Time range"
      collapsible
      summary={`${binDraft.value} ${
        BIN_UNIT_OPTIONS.find((option) => option.value === binDraft.unit)
          ?.label ?? binDraft.unit
      } · ${getDatetime(range.from)} — ${getDatetime(range.to)}`}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 1, flexWrap: "wrap" }}
      >
        <TextField
          size="small"
          type="number"
          label="Bin every"
          value={binDraft.value}
          onChange={(event) => handleBinValueChange(Number(event.target.value))}
          sx={{ width: 100 }}
          slotProps={{ htmlInput: { min: 1, max: 99999 } }}
        />

        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={binDraft.unit}
            onChange={(event) =>
              handleBinUnitChange(event.target.value as BinUnit)
            }
          >
            {BIN_UNIT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DateTimePicker
          label="From"
          value={dayjs(range.from)}
          onChange={handleFromChange}
          slotProps={{ textField: { size: "small" } }}
        />
        <DateTimePicker
          label="To"
          value={dayjs(range.to)}
          onChange={handleToChange}
          slotProps={{ textField: { size: "small" } }}
        />

        <Button
          size="small"
          variant="text"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ ml: "auto" }}
        >
          Reset
        </Button>
      </Stack>

      {hint && (
        <Typography variant="caption" color="text.secondary" component="div">
          {hint}
        </Typography>
      )}
    </SectionCard>
  );
};

export default TelemetryRangeCard;
