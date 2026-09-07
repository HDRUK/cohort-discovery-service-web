import dayjs from "dayjs";
import { HealthBin, TimeRange } from "@/types/api";

export type { TimeRange };

export const MAX_BINS = 2000;

export const DEFAULT_BIN = "1m";
export const DEFAULT_BIN_DRAFT: { value: number; unit: BinUnit } = {
  value: 1,
  unit: "m",
};

export const DEFAULT_RANGE_HOURS = 1;

export type BinUnit = "m" | "h" | "d" | "w";

export const BIN_UNIT_OPTIONS: { value: BinUnit; label: string }[] = [
  { value: "m", label: "minutes" },
  { value: "h", label: "hours" },
  { value: "d", label: "days" },
  { value: "w", label: "weeks" },
];

export const defaultRange = (): TimeRange => {
  const now = dayjs();

  return {
    from: now.subtract(DEFAULT_RANGE_HOURS, "hour").toISOString(),
    to: now.toISOString(),
  };
};

const NAMED_BIN_MINUTES: Record<HealthBin, number> = {
  minute: 1,
  hour: 60,
  day: 60 * 24,
  week: 60 * 24 * 7,
  month: 60 * 24 * 30,
};

const UNIT_MINUTES: Record<BinUnit, number> = {
  m: 1,
  h: 60,
  d: 60 * 24,
  w: 60 * 24 * 7,
};

const isNamedBin = (bin: string): bin is HealthBin =>
  Object.prototype.hasOwnProperty.call(NAMED_BIN_MINUTES, bin);

const CUSTOM_BIN_WIDTH_PATTERN = /^([1-9]\d{0,4})([mhdw])$/;

export const binWidthMinutes = (bin: string): number | null => {
  if (isNamedBin(bin)) return NAMED_BIN_MINUTES[bin];

  const match = CUSTOM_BIN_WIDTH_PATTERN.exec(bin);
  if (!match) return null;

  return Number(match[1]) * UNIT_MINUTES[match[2] as BinUnit];
};

export const isValidBinWidth = (bin: string): boolean =>
  binWidthMinutes(bin) !== null;

export const composeBinWidth = (value: number, unit: BinUnit): string =>
  `${value}${unit}`;

export const rangeMinutes = (range: TimeRange): number | null => {
  const from = dayjs(range.from);
  const to = dayjs(range.to);
  if (!from.isValid() || !to.isValid()) return null;

  const minutes = to.diff(from, "minute");
  return minutes > 0 ? minutes : null;
};

export const binCount = (bin: string, range: TimeRange): number | null => {
  const width = binWidthMinutes(bin);
  const minutes = rangeMinutes(range);
  if (width === null || minutes === null) return null;

  return Math.ceil(minutes / width);
};

export const TARGET_BINS = 60;

export const autoBinWidth = (
  spanMinutes: number,
  target = TARGET_BINS,
): string => {
  const raw = spanMinutes / target;

  if (raw < 60) return `${Math.max(1, Math.round(raw))}m`;
  if (raw < 60 * 24) return `${Math.round(raw / 60)}h`;
  if (raw < 60 * 24 * 7) return `${Math.round(raw / (60 * 24))}d`;

  return `${Math.round(raw / (60 * 24 * 7))}w`;
};

export const decomposeBinWidth = (
  bin: string,
): { value: number; unit: BinUnit } | null => {
  const match = CUSTOM_BIN_WIDTH_PATTERN.exec(bin);
  if (!match) return null;

  return { value: Number(match[1]), unit: match[2] as BinUnit };
};

const BIN_LABEL_FORMAT: Record<HealthBin, string> = {
  minute: "HH:mm",
  hour: "DD/MM HH:mm",
  day: "DD/MM",
  week: "DD/MM",
  month: "MMM YY",
};

const CUSTOM_BIN_LABEL_FORMAT: Record<BinUnit, string> = {
  m: "HH:mm",
  h: "DD/MM HH:mm",
  d: "DD/MM",
  w: "DD/MM",
};

export const formatBinLabel = (iso: string, bin: string): string => {
  const parsed = dayjs(iso);
  if (!parsed.isValid()) return "";

  if (isNamedBin(bin)) return parsed.format(BIN_LABEL_FORMAT[bin]);

  const match = CUSTOM_BIN_WIDTH_PATTERN.exec(bin);
  const unit = match ? (match[2] as BinUnit) : "m";
  return parsed.format(CUSTOM_BIN_LABEL_FORMAT[unit]);
};

export const tickStep = (binCountValue: number, target = 6): number =>
  Math.max(1, Math.ceil(binCountValue / target));

export const rangeFromBins = (
  binStarts: string[],
  startIndex: number,
  endIndex: number,
  bin: string,
  servedTo: string,
): TimeRange | null => {
  const from = binStarts[startIndex];
  const last = binStarts[endIndex];
  const width = binWidthMinutes(bin);
  if (!from || !last || width === null) return null;

  const end = dayjs(last).add(width, "minute");
  const to = end.isAfter(servedTo) ? dayjs(servedTo) : end;

  return { from, to: to.toISOString() };
};
