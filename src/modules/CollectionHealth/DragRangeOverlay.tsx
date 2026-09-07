"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDrawingArea, useSvgRef, useXScale } from "@mui/x-charts/hooks";

const MIN_DRAG_BINS = 2;

interface DragRangeOverlayProps {
  onSelect: (startIndex: number, endIndex: number) => void;
}

const DragRangeOverlay = ({ onSelect }: DragRangeOverlayProps) => {
  const { left, top, width, height } = useDrawingArea();
  const xScale = useXScale();
  const svgRef = useSvgRef();
  const theme = useTheme();

  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);

  const positions = xScale
    .domain()
    .map((value) => xScale(value as never) as number);

  const startIndexRef = useRef<number | null>(null);
  const latestRef = useRef({ positions, left, width, onSelect });
  useEffect(() => {
    latestRef.current = { positions, left, width, onSelect };
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

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

    const handlePointerUpAndStop = (event: PointerEvent) => {
      handlePointerUp(event);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUpAndStop);
    };

    const handlePointerDownAndTrack = (event: PointerEvent) => {
      handlePointerDown(event);
      if (startIndexRef.current === null) return;

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUpAndStop);
    };

    svg.addEventListener("pointerdown", handlePointerDownAndTrack);

    return () => {
      svg.removeEventListener("pointerdown", handlePointerDownAndTrack);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUpAndStop);
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
