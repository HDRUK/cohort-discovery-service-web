"use client";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Alert,
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
import { getDatetime } from "@/utils/date";
import SectionCard from "@/components/SectionCard";
import PingHistoryChart from "./PingHistoryChart";
import TaskHistoryChart from "./TaskHistoryChart";
import { BIN_UNIT_OPTIONS, BinUnit } from "./timeRange";
import { TelemetryRange } from "./useTelemetryRange";

interface CollectionTelemetryProps {
  collectionPid: string;
  telemetry: TelemetryRange;
}

const CollectionTelemetry = ({
  collectionPid,
  telemetry,
}: CollectionTelemetryProps) => {
  const {
    bin,
    binDraft,
    range,
    validationMessage,
    isQueryValid,
    handleSelectRange,
    handleReset,
    handleBinValueChange,
    handleBinUnitChange,
    handleFromChange,
    handleToChange,
  } = telemetry;

  return (
    <Stack spacing={2} sx={{ minWidth: 0 }}>
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
            onChange={(event) =>
              handleBinValueChange(Number(event.target.value))
            }
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

        {validationMessage && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            {validationMessage}
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" component="div">
          Drag across any plot to narrow the range — every plot follows it.
        </Typography>
      </SectionCard>

      <SectionCard title="Host polling">
        <PingHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
      </SectionCard>

      <SectionCard title="Task activity">
        <TaskHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
      </SectionCard>
    </Stack>
  );
};

export default CollectionTelemetry;
