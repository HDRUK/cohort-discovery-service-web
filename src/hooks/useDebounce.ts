import { useEffect, useState } from "react";

export const useDebounce = <T>(
  value: T,
  delay = 100,
  flushNow?: (v: T) => boolean
): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (flushNow?.(value)) {
      setDebounced(value);
    }
  }, [flushNow, setDebounced, value]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay, flushNow]);

  return debounced;
};
