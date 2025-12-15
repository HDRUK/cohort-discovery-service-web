import dayjs from "dayjs";

const getDate = (
  date?: string,
  format = "DD-MM-YYYY HH:MM:ss",
  emptyFallback = "--/--/----"
) => {
  if (!date) return emptyFallback;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return emptyFallback;

  return parsed.format(format);
};

export { getDate };
