import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable as useDndSortable,
  UseSortableArguments,
} from "@dnd-kit/sortable";
import { useState, useEffect, useRef, useMemo } from "react";
import { useElementSize } from "./useElementSize";
import { quantise } from "@/utils/numbers";

export interface UseSortablePlusReturn
  extends ReturnType<typeof useDndSortable> {
  isLast: boolean;
  style: React.CSSProperties;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  anchorSize: { width: number | string; height: number | string };
}

const useSortable = (args: UseSortableArguments): UseSortablePlusReturn => {
  const params = useDndSortable(args);

  const lastTransformStr = useRef<string | undefined>(undefined);

  const transform = useMemo(() => {
    if (!params.transform) return undefined;
    const q = {
      ...params.transform,
      x: quantise(params.transform.x ?? 0),
      y: quantise(params.transform.y ?? 0),
      scaleX: params.transform.scaleX ?? 1,
      scaleY: params.transform.scaleY ?? 1,
    };

    const next = CSS.Transform.toString(q);
    if (next === lastTransformStr.current) return lastTransformStr.current;
    lastTransformStr.current = next;
    return next;
  }, [params.transform]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      transform,
      transition: "transform 200ms ease",
      opacity: params.isDragging ? 0.6 : 1,
      willChange: "transform",
    }),
    [params.isDragging, transform]
  );

  const isLast = useMemo(
    () => params.newIndex === params.items.length - 2,
    [params.newIndex, params.items]
  );

  const [anchorRef, anchorSize] = useElementSize<HTMLDivElement>(args.id);

  return {
    ...params,
    isLast,
    style,
    anchorRef,
    anchorSize,
  };
};

export default useSortable;
