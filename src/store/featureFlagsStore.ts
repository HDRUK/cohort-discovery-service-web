"use client";

import { create } from "zustand";
import { FeatureFlag } from "@/types/features";

export interface FeatureFlagsStoreState {
  flags: FeatureFlag | null;
  setFlags: (flags: FeatureFlag) => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsStoreState>((set) => ({
  flags: null,

  setFlags: (flags) => set({ flags }),
}));
