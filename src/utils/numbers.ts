const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-UK").format(num);
};

const trueKeys = <T extends number>(obj: Record<T, boolean>): T[] =>
  Object.keys(obj)
    .filter((k) => obj[+k as unknown as T])
    .map((k) => +k as T);

const falseKeys = <T extends number>(obj: Record<T, boolean>): T[] =>
  Object.keys(obj)
    .filter((k) => !obj[+k as unknown as T])
    .map((k) => +k as T);

export { formatNumber, trueKeys, falseKeys };
