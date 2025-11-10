"use client";

import React, {
  useEffect,
  useRef,
  useState,
  RefObject,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

type MarqueeSelectionProps = {
  containerRef: RefObject<HTMLElement | null>;
  selectable?: string;
  idAttr?: string;
  onChange?: (ids: string[], deselectedIds: string[]) => void;
  onEnd?: (ids: string[]) => void;
  disabled?: boolean;
  requireModifierKey?: "Shift" | "Alt" | "Meta" | "Control" | null;
  ignoreWhenInside?: string;
  zIndex?: number;
};

type Rect = { x: number; y: number; w: number; h: number };

function normalizeRect(a: Rect): Rect {
  const x = Math.min(a.x, a.x + a.w);
  const y = Math.min(a.y, a.y + a.h);
  const w = Math.abs(a.w);
  const h = Math.abs(a.h);
  return { x, y, w, h };
}

function intersects(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

export default function MarqueeSelection({
  containerRef,
  selectable = '[data-selectable="true"]',
  idAttr = "data-id",
  onChange,
  onEnd,
  disabled,
  requireModifierKey = null,
  ignoreWhenInside = '[data-draggable="true"]',
  zIndex = 30,
}: MarqueeSelectionProps) {
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const rectRef = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [rectState, setRectState] = useState<Rect | null>(null);
  const latestSelected = useRef<string[]>([]);
  const insideRef = useRef<string>(null);

  const portalTarget = containerRef.current;

  useEffect(() => {
    if (!dragging) return;
    const prevUserSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "crosshair";
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    window.addEventListener("wheel", preventWheel, { passive: false });
    return () => {
      document.body.style.userSelect = prevUserSelect;
      document.body.style.cursor = prevCursor;
      window.removeEventListener("wheel", preventWheel);
    };
  }, [dragging]);

  const getLocalPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current!;
      const r = el.getBoundingClientRect();
      const x = clientX - r.left + el.scrollLeft;
      const y = clientY - r.top + el.scrollTop;
      return { x, y };
    },
    [containerRef]
  );

  const computeSelection = useCallback(
    (rectN: Rect) => {
      const el = containerRef.current!;
      const items = Array.from(el.querySelectorAll<HTMLElement>(selectable));
      const containerRect = el.getBoundingClientRect();
      const selection: string[] = [];
      for (const it of items) {
        const id = it.getAttribute(idAttr);
        if (!id) continue;
        const ir = it.getBoundingClientRect();
        const local: Rect = {
          x: ir.left - containerRect.left + el.scrollLeft,
          y: ir.top - containerRect.top + el.scrollTop,
          w: ir.width,
          h: ir.height,
        };
        if (intersects(rectN, local)) selection.push(id);
      }
      return selection;
    },
    [containerRef, idAttr, selectable]
  );

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      if (disabled) return;
      if (e.button !== 0) return;

      if (
        requireModifierKey &&
        !(
          (requireModifierKey === "Shift" && e.shiftKey) ||
          (requireModifierKey === "Alt" && e.altKey) ||
          (requireModifierKey === "Meta" && e.metaKey) ||
          (requireModifierKey === "Control" && e.ctrlKey)
        )
      ) {
        return;
      }

      insideRef.current = null;
      if (ignoreWhenInside) {
        const el = (e.target as HTMLElement)?.closest(ignoreWhenInside);
        const dataId = el?.getAttribute("data-id");
        insideRef.current = dataId || null;
      }

      const { left, top, right, bottom } = container.getBoundingClientRect();
      if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
      )
        return;

      container.setPointerCapture?.(e.pointerId);
      const p = getLocalPoint(e.clientX, e.clientY);
      startRef.current = p;
      rectRef.current = { x: p.x, y: p.y, w: 0, h: 0 };
      setRectState({ ...rectRef.current });
      latestSelected.current = [];
      setDragging(true);

      e.preventDefault();
      e.stopPropagation();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !startRef.current) return;
      const p = getLocalPoint(e.clientX, e.clientY);
      const start = startRef.current;
      rectRef.current = {
        x: start.x,
        y: start.y,
        w: p.x - start.x,
        h: p.y - start.y,
      };
      const rectN = normalizeRect(rectRef.current);
      setRectState(rectN);

      const selected = computeSelection(rectN).filter(
        (id) => id !== insideRef.current
      );
      const prev = latestSelected.current;

      const selectedSet = new Set(selected);
      const deselectedIds = prev.filter((id) => !selectedSet.has(id));

      const changed =
        selected.length !== prev.length ||
        selected.some((id, i) => id !== prev[i]);

      if (changed) {
        onChange?.(selected, deselectedIds);
        latestSelected.current = selected;
      }

      e.preventDefault();
      e.stopPropagation();
    };

    const endDrag = () => {
      if (!dragging) return;
      setDragging(false);
      setRectState(null);
      onEnd?.(latestSelected.current);
      startRef.current = null;
      latestSelected.current = [];
    };

    const onPointerUp = () => endDrag();
    const onPointerCancel = () => endDrag();

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [
    containerRef,
    selectable,
    idAttr,
    onChange,
    onEnd,
    disabled,
    dragging,
    ignoreWhenInside,
    requireModifierKey,
    computeSelection,
    getLocalPoint,
  ]);

  if (!portalTarget || !rectState) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    left: rectState.x,
    top: rectState.y,
    width: rectState.w,
    height: rectState.h,
    pointerEvents: "none",
    border: "1px solid rgba(59,130,246,0.9)", // Tailwind blue-500-ish
    background: "rgba(59,130,246,0.15)",
    boxShadow: "0 0 0 1px rgba(59,130,246,0.2) inset",
    borderRadius: 4,
    zIndex,
  };

  return createPortal(<div style={style} />, portalTarget);
}
