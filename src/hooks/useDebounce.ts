import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 100): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
};
