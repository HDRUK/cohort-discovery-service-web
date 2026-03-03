import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseDebounceOptionsProps<T> = {
  delay?: number;
  shouldApplyImmediately?: (v: T) => boolean;
  onValueChange?: (v: T) => void;
};

export const useDebounce = <T>(
  value: T,
  {
    delay = 100,
    shouldApplyImmediately,
    onValueChange,
  }: UseDebounceOptionsProps<T>,
) => {
  const [debounced, setDebounced] = useState(value);

  const latestOnChange = useRef(onValueChange);
  useEffect(() => {
    latestOnChange.current = onValueChange;
  }, [onValueChange]);

  const shouldFlush = useMemo(
    () => (shouldApplyImmediately ? shouldApplyImmediately(value) : false),
    [shouldApplyImmediately, value],
  );

  const flush = useCallback(() => {
    setDebounced(value);
    latestOnChange.current?.(value);
  }, [value]);

  useEffect(() => {
    const ms = shouldFlush ? 0 : delay;
    const id = globalThis.setTimeout(flush, ms);
    return () => globalThis.clearTimeout(id);
  }, [delay, shouldFlush, flush]);

  return { debounced, flush };
};
