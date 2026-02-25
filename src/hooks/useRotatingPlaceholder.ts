import { useEffect, useMemo, useState } from "react";

export default function useRotatingPlaceholder(
  placeholders: string[] | undefined,
  intervalMs = 2000,
) {
  const list = useMemo(
    () => (placeholders ?? []).filter(Boolean),
    [placeholders],
  );
  const [index, setIndex] = useState(0);

  const safeIndex = list.length ? index % list.length : 0;

  useEffect(() => {
    if (list.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [list.length, intervalMs]);

  return list.length ? list[safeIndex] : undefined;
}
