const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-UK").format(num);
};

const trueKeys = <K extends string | number>(obj: Record<K, boolean>): K[] => {
  return (Object.entries(obj) as [K, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => key);
};

const falseKeys = <K extends string | number>(obj: Record<K, boolean>): K[] => {
  return (Object.entries(obj) as [K, boolean][])
    .filter(([, value]) => !value)
    .map(([key]) => key);
};
export { formatNumber, trueKeys, falseKeys };
