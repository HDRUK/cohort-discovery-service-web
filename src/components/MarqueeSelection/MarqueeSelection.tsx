"use client";

import { useLogDependencyChanges } from "@/utils/deps";
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
  dragThresholdPx?: number; // NEW: how far mouse must move before we start marquee
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
  dragThresholdPx = 4,
}: MarqueeSelectionProps) {
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const rectRef = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [rectState, setRectState] = useState<Rect | null>(null);
  const latestSelected = useRef<string[]>([]);
  const insideRef = useRef<string | null>(null);

  const pendingRef = useRef(false);
  const startClientRef = useRef<{ x: number; y: number } | null>(null);

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(containerRef.current);
  }, [containerRef]);

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

      const clampedX = Math.min(Math.max(clientX, r.left), r.right - 1);
      const clampedY = Math.min(Math.max(clientY, r.top), r.bottom - 1);

      const x = clampedX - r.left + el.scrollLeft;
      const y = clampedY - r.top + el.scrollTop;

      return { x, y };
    },
    [containerRef],
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
    [containerRef, idAttr, selectable],
  );

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;

    const passesModifier = (e: PointerEvent) => {
      if (!requireModifierKey) return true;
      if (requireModifierKey === "Shift") return e.shiftKey;
      if (requireModifierKey === "Alt") return e.altKey;
      if (requireModifierKey === "Meta") return e.metaKey;
      if (requireModifierKey === "Control") return e.ctrlKey;
      return true;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (disabled) return;
      if (e.button !== 0) return;
      if (!passesModifier(e)) return;

      if (ignoreWhenInside) {
        const inside = (e.target as HTMLElement)?.closest(ignoreWhenInside);
        if (inside) return;
      }

      const { left, top, right, bottom } = container.getBoundingClientRect();
      if (
        e.clientX < left ||
        e.clientX > right ||
        e.clientY < top ||
        e.clientY > bottom
      ) {
        return;
      }

      const p = getLocalPoint(e.clientX, e.clientY);
      startRef.current = p;
      startClientRef.current = { x: e.clientX, y: e.clientY };
      pendingRef.current = true;

      rectRef.current = { x: p.x, y: p.y, w: 0, h: 0 };
      latestSelected.current = [];
      insideRef.current = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (disabled) return;
      if (!pendingRef.current || !startRef.current || !startClientRef.current)
        return;

      if (!dragging) {
        const dx = e.clientX - startClientRef.current.x;
        const dy = e.clientY - startClientRef.current.y;
        if (Math.hypot(dx, dy) < dragThresholdPx) return;

        container.setPointerCapture?.(e.pointerId);
        setDragging(true);

        const rectN0 = normalizeRect(rectRef.current);
        setRectState(rectN0);

        e.preventDefault();
        e.stopPropagation();
        return;
      }

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
        (id) => id !== insideRef.current,
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
      if (!pendingRef.current) return;

      pendingRef.current = false;
      startClientRef.current = null;
      insideRef.current = null;

      if (!dragging) {
        startRef.current = null;
        latestSelected.current = [];
        return;
      }

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
    dragThresholdPx,
  ]);

  useLogDependencyChanges("selection-effect", {
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
    dragThresholdPx,
  });

  if (!portalTarget || !rectState) return null;

  const containerRect = portalTarget.getBoundingClientRect();
  const left = containerRect.left + rectState.x - portalTarget.scrollLeft;
  const top = containerRect.top + rectState.y - portalTarget.scrollTop;

  const style: React.CSSProperties = {
    position: "fixed",
    left,
    top,
    width: rectState.w,
    height: rectState.h,
    pointerEvents: "none",
    border: "1px solid rgba(59,130,246,0.9)",
    background: "rgba(59,130,246,0.15)",
    boxShadow: "0 0 0 1px rgba(59,130,246,0.2) inset",
    borderRadius: 4,
    zIndex,
  };

  return createPortal(<div style={style} />, portalTarget);
}
