"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  RefObject,
  PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

type MarqueeSelectionProps = {
  /** The scrollable/positioned container that holds all selectable items */
  containerRef: RefObject<HTMLElement | null>;
  /** CSS selector to find selectable elements inside container */
  selectable?: string; // e.g. '.rule-card' or '[data-selectable="true"]'
  /** Attribute on items to read their id from */
  idAttr?: string; // default: 'data-id'
  /** Called whenever the selection set changes while dragging */
  onChange?: (ids: string[]) => void;
  /** Called once after the user releases the mouse */
  onEnd?: (ids: string[]) => void;
  /** If true, disables marquee entirely */
  disabled?: boolean;
  /** Hold this key to force marquee even when starting over an item */
  requireModifierKey?: "Shift" | "Alt" | "Meta" | "Control" | null;
  /** Optional: prevent starting marquee when pointerdown is inside this selector */
  ignoreWhenInside?: string; // e.g. '[data-draggable="true"]'
  /** Z-index for the rectangle overlay */
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

  // We render the rectangle inside the same container so coords match.
  const portalTarget = containerRef.current;

  // Prevent text selection & scrolling while dragging
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

  // Helper: get pointer pos relative to container content (accounts for scroll)
  const getLocalPoint = (clientX: number, clientY: number) => {
    const el = containerRef.current!;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left + el.scrollLeft;
    const y = clientY - r.top + el.scrollTop;
    return { x, y };
  };

  const computeSelection = (rectN: Rect) => {
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
  };

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      if (disabled) return;
      if (e.button !== 0) return; // left click only

      // If a modifier is required, enforce it
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

      // Avoid starting on interactive/draggable elements unless forced w/ modifier
      if (
        ignoreWhenInside &&
        (e.target as HTMLElement)?.closest(ignoreWhenInside)
      ) {
        if (!requireModifierKey) return; // only allow if modifier is held and we configured one
      }

      // Only start if click occurs within the container bounds
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

      // Stop dnd-kit from also activating
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

      const selected = computeSelection(rectN);
      // Avoid thrashing onChange
      const prev = latestSelected.current;
      if (
        selected.length !== prev.length ||
        selected.some((id, i) => id !== prev[i])
      ) {
        latestSelected.current = selected;
        onChange?.(selected);
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
  ]);

  if (!portalTarget || !rectState) return null;

  // The overlay rectangle
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
