import dayjs from "dayjs";

const getDatetime = (
  date?: string,
  format = "DD/MM/YYYY HH:mm:ss",
  emptyFallback = "--/--/----",
) => {
  if (!date) return emptyFallback;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return emptyFallback;

  return parsed.format(format);
};

const getTimestamp = (date?: string): number => {
  if (!date) return 0;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return 0;

  return parsed.valueOf();
};

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;

const formatAge = (date?: string | null, now: number = Date.now()): string => {
  if (!date) return "never";

  const parsed = dayjs(date);
  if (!parsed.isValid()) return "never";

  const ms = now - parsed.valueOf();
  if (ms < 0) return "now";

  const seconds = Math.floor(ms / MS_PER_SECOND);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
};

const formatDuration = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return "—";
  if (ms < MS_PER_SECOND) return `${Math.round(ms)}ms`;

  if (ms < MS_PER_MINUTE) {
    const seconds = ms / MS_PER_SECOND;
    return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`;
  }

  const minutes = Math.floor(ms / MS_PER_MINUTE);
  const seconds = Math.round((ms % MS_PER_MINUTE) / MS_PER_SECOND);

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
};

const getDurationSeconds = (
  start?: string | null,
  end?: string | null,
): string | null => {
  const s = getTimestamp(start ?? undefined);
  const e = getTimestamp(end ?? undefined);
  if (!s || !e) return null;
  return `${((e - s) / 1000).toFixed(1)}s`;
};

export {
  formatAge,
  formatDuration,
  getDatetime,
  getDurationSeconds,
  getTimestamp,
  MS_PER_MINUTE,
  MS_PER_SECOND,
};
