const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-UK").format(num);
};

const trueKeys = <K extends string | number>(obj: Record<K, boolean>): K[] => {
  return (Object.entries(obj) as [K, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => key);
};

const falseKeys = <T extends number | string>(obj: Record<T, boolean>): T[] =>
  Object.keys(obj)
    .filter((k) => !obj[+k as unknown as T])
    .map((k) => +k as T);

export { formatNumber, trueKeys, falseKeys };
