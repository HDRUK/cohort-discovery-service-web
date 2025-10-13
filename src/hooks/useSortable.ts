import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import {
  useSortable as useDndSortable,
  UseSortableArguments,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { useElementSize } from "./useElementSize";

export interface UseSortablePlusReturn
  extends ReturnType<typeof useDndSortable> {
  isLast: boolean;
  style: React.CSSProperties;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  anchorSize: { width: number | string; height: number | string };
}

const useSortable = (args: UseSortableArguments): UseSortablePlusReturn => {
  const params = useDndSortable(args);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(params.transform),
    transition: params.transition,
    opacity: params.isDragging ? 0.6 : 1,
    willChange: "transform",
  };

  const [stableIsLast, setStableIsLast] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // note: this is -2 because need to remove all the bounding group
      //       that is included in the items
      setStableIsLast(params.newIndex === params.items.length - 2);
    }, 100);
    return () => clearTimeout(timeout);
  }, [params.newIndex, params.items]);

  const [anchorRef, anchorSize] = useElementSize<HTMLDivElement>(args.id);

  return {
    ...params,
    isLast: stableIsLast,
    style,
    anchorRef,
    anchorSize,
  };
};

export default useSortable;
