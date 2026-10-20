"use client";

import { useCallback, useMemo, useState } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import { getDatetime } from "@/utils/date";
import SectionCard from "@/components/SectionCard";
import useSearchParams from "@/hooks/useSearchParams";
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

export const PARAM_BIN = "bin";
export const PARAM_BIN_UNIT = "binUnit";
export const PARAM_FROM = "from";
export const PARAM_TO = "to";

const isBinUnit = (value: string | null): value is BinUnit =>
  BIN_UNIT_OPTIONS.some((option) => option.value === value);

interface CollectionTelemetryProps {
  collectionPid: string;
}

const CollectionTelemetry = ({ collectionPid }: CollectionTelemetryProps) => {
  const { searchParams, setSearchParams } = useSearchParams();

  const [fallbackRange] = useState<TimeRange>(defaultRange);

  const rawBin = Number(searchParams.get(PARAM_BIN));
  const rawUnit = searchParams.get(PARAM_BIN_UNIT);

  const binDraft = {
    value:
      Number.isFinite(rawBin) && rawBin > 0 ? rawBin : DEFAULT_BIN_DRAFT.value,
    unit: isBinUnit(rawUnit) ? rawUnit : DEFAULT_BIN_DRAFT.unit,
  };

  const from = searchParams.get(PARAM_FROM) ?? fallbackRange.from;
  const to = searchParams.get(PARAM_TO) ?? fallbackRange.to;

  const range = useMemo<TimeRange>(() => ({ from, to }), [from, to]);

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

  const handleSelectRange = useCallback(
    (next: TimeRange) => {
      const minutes = rangeMinutes(next);
      if (minutes === null) return;

      const decomposed = decomposeBinWidth(autoBinWidth(minutes));

      setSearchParams({
        [PARAM_FROM]: next.from,
        [PARAM_TO]: next.to,
        ...(decomposed && {
          [PARAM_BIN]: String(decomposed.value),
          [PARAM_BIN_UNIT]: decomposed.unit,
        }),
      });
    },
    [setSearchParams],
  );

  const handleReset = () => {
    const next = defaultRange();

    setSearchParams({
      [PARAM_BIN]: String(DEFAULT_BIN_DRAFT.value),
      [PARAM_BIN_UNIT]: DEFAULT_BIN_DRAFT.unit,
      [PARAM_FROM]: next.from,
      [PARAM_TO]: next.to,
    });
  };

  const handleFromChange = (value: Dayjs | null) => {
    if (!value?.isValid()) return;
    setSearchParams({ [PARAM_FROM]: value.toISOString() });
  };

  const handleToChange = (value: Dayjs | null) => {
    if (!value?.isValid()) return;
    setSearchParams({ [PARAM_TO]: value.toISOString() });
  };

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
              setSearchParams({ [PARAM_BIN]: event.target.value })
            }
            sx={{ width: 100 }}
            slotProps={{ htmlInput: { min: 1, max: 99999 } }}
          />

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <Select
              value={binDraft.unit}
              onChange={(event) =>
                setSearchParams({ [PARAM_BIN_UNIT]: event.target.value })
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
