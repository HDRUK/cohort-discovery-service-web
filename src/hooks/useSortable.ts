import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable as useDndSortable,
  UseSortableArguments,
} from "@dnd-kit/sortable";
import { useRef, useMemo } from "react";
import { useElementSize } from "./useElementSize";
import { quantise } from "@/utils/numbers";
import { useDndContext } from "@dnd-kit/core";
import { useDaphneStore } from "@/store/useDaphneStore";

export interface UseSortablePlusReturn
  extends ReturnType<typeof useDndSortable> {
  isLast: boolean;
  style: React.CSSProperties;
  anchorRef: React.RefObject<HTMLDivElement | HTMLLIElement | null>;
  anchorSize: { width: number | string; height: number | string };
  isOver: boolean;
  isAbove: boolean;
}

const useSortable = (args: UseSortableArguments): UseSortablePlusReturn => {
  const {
    queryBuilder: { boardIndex },
  } = useDaphneStore();
  const params = useDndSortable(args);
  const { over, active } = useDndContext();

  const isOver = useMemo(
    () => over?.id !== active?.id && over?.id === args.id,
    [over, active, args.id]
  );

  const isAbove = useMemo(() => {
    if (!over?.id) return false;
    const overId = over?.data?.current?.id;
    const activeId = active?.data?.current?.id;
    const overGroupId = over?.data?.current?.groupId;

    const board = boardIndex.itemsByGroup[overGroupId];
    const currentIndex = board.indexOf(activeId as string);
    const targetIndex = board.indexOf(overId as string);

    return currentIndex >= targetIndex;
  }, [active, over, boardIndex]);

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
      transition: params.transition,
      opacity: params.isDragging ? 0.6 : 1,
      willChange: "transform",
    }),
    [params.isDragging, params.transition, transform]
  );

  const isLast = useMemo(
    () => params.newIndex === params.items.length - 2,
    [params.newIndex, params.items]
  );

  const [anchorRef, anchorSize] = useElementSize<
    HTMLDivElement | HTMLLIElement
  >(args.id);

  return {
    ...params,
    isLast,
    style,
    anchorRef,
    anchorSize,
    isOver,
    isAbove,
  };
};

export default useSortable;
