import { useEffect, useMemo, useState } from "react";

export const useDebounce = <T>(
  value: T,
  delay = 100,
  flushNow?: (v: T) => boolean,
): T => {
  const [debounced, setDebounced] = useState(value);

  const shouldFlush = useMemo(
    () => (flushNow ? flushNow(value) : false),
    [flushNow, value],
  );

  useEffect(() => {
    const ms = shouldFlush ? 0 : delay;
    const id = globalThis.setTimeout(() => {
      setDebounced(value);
    }, ms);

    return () => globalThis.clearTimeout(id);
  }, [value, delay, shouldFlush]);

  return debounced;
};
