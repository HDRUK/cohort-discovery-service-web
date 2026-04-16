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

export { getDatetime, getTimestamp };
