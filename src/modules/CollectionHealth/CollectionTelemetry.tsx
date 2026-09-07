"use client";

import { useCallback, useMemo, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import PingHistoryChart from "./PingHistoryChart";
import TaskHistoryChart from "./TaskHistoryChart";
import {
  autoBinWidth,
  BIN_UNIT_OPTIONS,
  BinUnit,
  binCount,
  composeBinWidth,
  decomposeBinWidth,
  DEFAULT_BIN_DRAFT,
  defaultRange,
  isValidBinWidth,
  MAX_BINS,
  rangeMinutes,
  TimeRange,
} from "./timeRange";

interface CollectionTelemetryProps {
  collectionPid: string;
}

const CollectionTelemetry = ({ collectionPid }: CollectionTelemetryProps) => {
  const [binDraft, setBinDraft] = useState(DEFAULT_BIN_DRAFT);
  const [range, setRange] = useState<TimeRange>(defaultRange);

  const bin = composeBinWidth(binDraft.value, binDraft.unit);

  const validationMessage = useMemo(() => {
    if (!isValidBinWidth(bin)) return "Enter a bin width of at least 1.";

    if (rangeMinutes(range) === null) {
      return "Choose a “to” date and time after “from”.";
    }

    const bins = binCount(bin, range);
    if (bins !== null && bins > MAX_BINS) {
      return `That range needs ${bins.toLocaleString()} bins at this width — narrow the range or pick a coarser bin.`;
    }

    return null;
  }, [bin, range]);

  const isQueryValid = validationMessage === null;

  const handleSelectRange = useCallback((next: TimeRange) => {
    const minutes = rangeMinutes(next);
    if (minutes === null) return;

    const decomposed = decomposeBinWidth(autoBinWidth(minutes));
    if (decomposed) setBinDraft(decomposed);

    setRange(next);
  }, []);

  const handleReset = () => {
    setBinDraft(DEFAULT_BIN_DRAFT);
    setRange(defaultRange());
  };

  const handleFromChange = (value: Dayjs | null) => {
    if (!value?.isValid()) return;
    setRange((current) => ({ ...current, from: value.toISOString() }));
  };

  const handleToChange = (value: Dayjs | null) => {
    if (!value?.isValid()) return;
    setRange((current) => ({ ...current, to: value.toISOString() }));
  };

  return (
    <Box sx={{ minWidth: 0 }}>
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
            setBinDraft((current) => ({
              ...current,
              value: Number(event.target.value),
            }))
          }
          sx={{ width: 100 }}
          slotProps={{ htmlInput: { min: 1, max: 99999 } }}
        />

        <FormControl size="small" sx={{ minWidth: 110 }}>
          <Select
            value={binDraft.unit}
            onChange={(event) =>
              setBinDraft((current) => ({
                ...current,
                unit: event.target.value as BinUnit,
              }))
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

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        Drag across any plot to narrow the range — every plot below follows it.
      </Typography>

      <Stack spacing={3} sx={{ mt: 1 }}>
        <PingHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
        <TaskHistoryChart
          collectionPid={collectionPid}
          bin={bin}
          range={range}
          enabled={isQueryValid}
          onSelectRange={handleSelectRange}
        />
      </Stack>
    </Box>
  );
};

export default CollectionTelemetry;
