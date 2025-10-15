const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-UK").format(num);
};

const trueKeys = <T extends string | number>(obj: Record<T, boolean>): T[] => {
  return (Object.entries(obj) as [T, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => key);
};

const falseKeys = <T extends string | number>(obj: Record<T, boolean>): T[] => {
  return (Object.entries(obj) as [T, boolean][])
    .filter(([, value]) => !value)
    .map(([key]) => key);
};

const quantise = (n: number, step = 0.1) => {
  return Math.round(n / step) * step;
};
export { quantise, formatNumber, trueKeys, falseKeys };
