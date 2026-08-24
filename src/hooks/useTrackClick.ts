"use client";

import { useCallback } from "react";
import trackClick, { TrackClickInput } from "@/actions/trackClick";

const useTrackClick = () => {
  return useCallback((input: TrackClickInput) => {
    trackClick(input).catch(() => {});
  }, []);
};

export default useTrackClick;
