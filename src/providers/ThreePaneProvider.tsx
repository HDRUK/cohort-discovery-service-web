"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ExpandedSide } from "@/modules/ThreePaneSwimLaneLayout";

type ThreePaneCtx = {
  expandedSide: ExpandedSide | null;
  expandedLeft: boolean;
  expandedRight: boolean;

  openLeft: () => void;
  openRight: () => void;
  closeLeft: () => void;
  closeRight: () => void;

  toggleLeft: () => void;
  toggleRight: () => void;

  setExpandedSide: React.Dispatch<React.SetStateAction<ExpandedSide | null>>;
};

const ThreePaneContext = createContext<ThreePaneCtx | null>(null);

export function ThreePaneProvider({
  children,
  defaultExpandedSide = null,
  onOpenLeft,
  onOpenRight,
  onClose,
}: {
  children: React.ReactNode;
  defaultExpandedSide?: ExpandedSide | null;
  onOpenLeft?: () => void;
  onOpenRight?: () => void;
  onClose?: () => void;
}) {
  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(
    defaultExpandedSide,
  );

  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const close = useCallback(() => {
    setExpandedSide(null);
    onClose?.();
  }, [onClose]);

  const openLeft = useCallback(() => {
    setExpandedSide(ExpandedSide.LEFT);
    onOpenLeft?.();
  }, [onOpenLeft]);

  const openRight = useCallback(() => {
    setExpandedSide(ExpandedSide.RIGHT);
    onOpenRight?.();
  }, [onOpenRight]);

  const closeLeft = useCallback(() => {
    if (expandedSide === ExpandedSide.LEFT) close();
  }, [expandedSide, close]);

  const closeRight = useCallback(() => {
    if (expandedSide === ExpandedSide.RIGHT) close();
  }, [expandedSide, close]);

  const toggleLeft = useCallback(() => {
    setExpandedSide((prev) => {
      const next = prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT;
      if (next === ExpandedSide.LEFT) onOpenLeft?.();
      if (next === null) onClose?.();
      return next;
    });
  }, [onOpenLeft, onClose]);

  const toggleRight = useCallback(() => {
    setExpandedSide((prev) => {
      const next = prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT;
      if (next === ExpandedSide.RIGHT) onOpenRight?.();
      if (next === null) onClose?.();
      return next;
    });
  }, [onOpenRight, onClose]);

  const value = useMemo(
    () => ({
      expandedSide,
      expandedLeft,
      expandedRight,
      openLeft,
      openRight,
      closeLeft,
      closeRight,
      toggleLeft,
      toggleRight,
      setExpandedSide,
    }),
    [
      expandedSide,
      expandedLeft,
      expandedRight,
      openLeft,
      openRight,
      closeLeft,
      closeRight,
      toggleLeft,
      toggleRight,
    ],
  );

  return (
    <ThreePaneContext.Provider value={value}>
      {children}
    </ThreePaneContext.Provider>
  );
}

export function useThreePane() {
  const ctx = useContext(ThreePaneContext);
  if (!ctx)
    throw new Error("useThreePane must be used within ThreePaneProvider");
  return ctx;
}
