export const pick = <T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[],
): Pick<T, K> =>
  Object.fromEntries(
    keys
      .filter((key) => Object.hasOwn(value, key))
      .map((key) => [key, value[key]]),
  ) as Pick<T, K>;
