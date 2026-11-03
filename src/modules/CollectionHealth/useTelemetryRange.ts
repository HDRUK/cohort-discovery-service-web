"use client";

import { useCallback, useMemo, useState } from "react";
import { Dayjs } from "dayjs";
import useSearchParams from "@/hooks/useSearchParams";
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

const useTelemetryRange = () => {
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

  const handleReset = useCallback(() => {
    const next = defaultRange();

    setSearchParams({
      [PARAM_BIN]: String(DEFAULT_BIN_DRAFT.value),
      [PARAM_BIN_UNIT]: DEFAULT_BIN_DRAFT.unit,
      [PARAM_FROM]: next.from,
      [PARAM_TO]: next.to,
    });
  }, [setSearchParams]);

  const handleBinValueChange = useCallback(
    (value: number) => setSearchParams({ [PARAM_BIN]: String(value) }),
    [setSearchParams],
  );

  const handleBinUnitChange = useCallback(
    (unit: BinUnit) => setSearchParams({ [PARAM_BIN_UNIT]: unit }),
    [setSearchParams],
  );

  const handleFromChange = useCallback(
    (value: Dayjs | null) => {
      if (!value?.isValid()) return;
      setSearchParams({ [PARAM_FROM]: value.toISOString() });
    },
    [setSearchParams],
  );

  const handleToChange = useCallback(
    (value: Dayjs | null) => {
      if (!value?.isValid()) return;
      setSearchParams({ [PARAM_TO]: value.toISOString() });
    },
    [setSearchParams],
  );

  return {
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
  };
};

export type TelemetryRange = ReturnType<typeof useTelemetryRange>;

export default useTelemetryRange;
