import { useLayoutEffect, useMemo, useRef } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import useQueryBuilder from "@/store/useQueryBuilder";
import { useDebouncedCallback } from "./useDebounceCallback";

interface ElementSizeProps {
  minHeight?: number | string;
  minWidth?: number | string;
}

export function useElementSize<T extends HTMLElement>(
  id: UniqueIdentifier,
  { minHeight = 100, minWidth = "100%" }: ElementSizeProps = {},
  delay: number = 100,
): [
  React.RefObject<T | null>,
  { width: number | string; height: number | string }
] {
  const { sizeCache, setSizeCache } = useQueryBuilder((qb) => ({
    sizeCache: qb.sizeCache,
    setSizeCache: qb.setSizeCache,
  }));

  const setSizeCacheDebounced = useDebouncedCallback(setSizeCache, delay);

  const size = useMemo(
    () => sizeCache[id] ?? { height: minHeight, width: minWidth },
    [id, sizeCache, minHeight, minWidth],
  );

  const ref = useRef<T>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) {
        if (size.height !== r.height || size.width !== r.width) {
          setSizeCacheDebounced(id, r.width, r.height);
        }
      }
    };

    update();

    const RO =
      typeof ResizeObserver !== "undefined"
        ? ResizeObserver
        : (class {
            observe() {}
            disconnect() {}
          } as unknown as typeof ResizeObserver);

    const ro = new RO(() => update());
    ro.observe(el);
    observerRef.current = ro;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = null;
    };
  }, [id, size, setSizeCacheDebounced]);

  return [ref, size];
}
