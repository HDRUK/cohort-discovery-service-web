import { useEffect, useMemo, useRef, useState } from "react";

type UseDebounceOptionsProps<T> = {
  delay?: number;
  shouldApplyImmediately?: (v: T) => boolean;
  onSetValue?: (v: T) => void;
};

export const useDebounce = <T>(
  value: T,
  {
    delay = 100,
    shouldApplyImmediately,
    onSetValue,
  }: UseDebounceOptionsProps<T>,
) => {
  const [debounced, setDebounced] = useState(value);

  const latestOnSet = useRef(onSetValue);

  const shouldFlush = useMemo(
    () => (shouldApplyImmediately ? shouldApplyImmediately(value) : false),
    [shouldApplyImmediately, value],
  );

  const flush = () => {
    setDebounced(value);
    latestOnSet.current?.(value);
  };

  useEffect(() => {
    const ms = shouldFlush ? 0 : delay;

    const id = globalThis.setTimeout(() => {
      setDebounced(value);
      latestOnSet.current?.(value);
    }, ms);

    return () => globalThis.clearTimeout(id);
  }, [value, delay, shouldFlush]);

  return { debounced, flush };
};
