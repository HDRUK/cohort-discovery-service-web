const formatNumber = (value: unknown) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num)
    ? new Intl.NumberFormat("en-UK").format(num)
    : "-";
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

const removeFalseKeys = <T extends string | number>(
  obj: Record<T, boolean>
): Record<T, boolean> =>
  (Object.entries(obj) as [T, boolean][]).reduce((acc, [key, value]) => {
    if (value) acc[key] = true;
    return acc;
  }, {} as Record<T, boolean>);

const quantise = (n: number, step = 0.1) => {
  return Math.round(n / step) * step;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export { quantise, formatNumber, trueKeys, falseKeys, removeFalseKeys, clamp };
