"use client";

import { useCallback } from "react";
import trackClick, { TrackClickInput } from "@/actions/trackClick";

// Fire-and-forget click tracking; never throws so a failed track can't break the UI.
const useTrackClick = () => {
  return useCallback((input: TrackClickInput) => {
    trackClick(input).catch(() => {});
  }, []);
};

export default useTrackClick;
