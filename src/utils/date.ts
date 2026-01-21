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

export { getDatetime };
