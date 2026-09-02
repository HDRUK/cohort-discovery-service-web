"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDrawingArea, useSvgRef, useXScale } from "@mui/x-charts/hooks";

// A drag has to cover at least this many bins to count as a range selection —
// below it the gesture is a click, and is left to the chart's own handlers.
const MIN_DRAG_BINS = 2;

interface DragRangeOverlayProps {
  /** Bin indices the drag covers, always ascending. */
  onSelect: (startIndex: number, endIndex: number) => void;
}

/**
 * Drag-to-select a time range on the plot. Renders inside the chart's SVG, so
 * it has access to the drawing area and x scale.
 *
 * Listeners sit on the SVG root rather than on a hit-testing rect, so the
 * chart's own tooltip and highlight handlers keep firing underneath.
 */
const DragRangeOverlay = ({ onSelect }: DragRangeOverlayProps) => {
  const { left, top, width, height } = useDrawingArea();
  const xScale = useXScale();
  const svgRef = useSvgRef();
  const theme = useTheme();

  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);

  // Positions of every bin, in SVG user space. Derived from the scale rather
  // than assumed, so it holds whatever padding MUI gives the point scale.
  const positions = xScale
    .domain()
    .map((value) => xScale(value as never) as number);

  // The scale is a fresh object each render and a drag re-renders on every
  // move, so the listeners read through refs instead of closing over values —
  // otherwise the effect would tear down mid-drag and lose the start index.
  const startIndexRef = useRef<number | null>(null);
  const latestRef = useRef({ positions, left, width, onSelect });
  useEffect(() => {
    latestRef.current = { positions, left, width, onSelect };
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Screen -> SVG user space, via the element's own transform matrix, so
    // viewBox scaling and any page zoom are handled for us.
    const toSvgX = (clientX: number, clientY: number) => {
      const matrix = svg.getScreenCTM();
      if (!matrix) return null;

      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;

      return point.matrixTransform(matrix.inverse()).x;
    };

    const nearestIndex = (x: number) => {
      const { positions: current } = latestRef.current;

      let best = 0;
      current.forEach((position, index) => {
        if (Math.abs(position - x) < Math.abs(current[best] - x)) {
          best = index;
        }
      });

      return best;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const { positions: current, left: x0, width: w } = latestRef.current;
      if (event.button !== 0 || current.length < MIN_DRAG_BINS) return;

      const x = toSvgX(event.clientX, event.clientY);
      if (x === null || x < x0 || x > x0 + w) return;

      const index = nearestIndex(x);
      startIndexRef.current = index;
      setDrag({ from: index, to: index });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const from = startIndexRef.current;
      if (from === null) return;

      const x = toSvgX(event.clientX, event.clientY);
      if (x === null) return;

      setDrag({ from, to: nearestIndex(x) });
    };

    const handlePointerUp = (event: PointerEvent) => {
      const from = startIndexRef.current;
      if (from === null) return;

      startIndexRef.current = null;
      setDrag(null);

      const x = toSvgX(event.clientX, event.clientY);
      if (x === null) return;

      const to = nearestIndex(x);
      if (Math.abs(to - from) + 1 >= MIN_DRAG_BINS) {
        latestRef.current.onSelect(Math.min(from, to), Math.max(from, to));
      }
    };

    svg.addEventListener("pointerdown", handlePointerDown);
    // Move and release are tracked on the window so a drag that leaves the
    // chart still resolves rather than sticking.
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      svg.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [svgRef]);

  if (!drag || drag.from === drag.to) return null;

  const fromX = positions[Math.min(drag.from, drag.to)];
  const toX = positions[Math.max(drag.from, drag.to)];

  return (
    <rect
      x={fromX}
      y={top}
      width={Math.max(toX - fromX, 1)}
      height={height}
      fill={theme.palette.text.primary}
      fillOpacity={0.12}
      stroke={theme.palette.text.primary}
      strokeOpacity={0.4}
      strokeWidth={1}
      pointerEvents="none"
    />
  );
};

export default DragRangeOverlay;
