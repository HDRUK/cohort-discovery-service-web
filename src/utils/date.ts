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

const getDurationSeconds = (
  start?: string | null,
  end?: string | null,
): string | null => {
  const s = getTimestamp(start ?? undefined);
  const e = getTimestamp(end ?? undefined);
  if (!s || !e) return null;
  return `${((e - s) / 1000).toFixed(1)}s`;
};

export { getDatetime, getTimestamp, getDurationSeconds };
