import { create } from "zustand";
import { FeatureFlag } from "@/types/api";

export interface FeatureFlagsStoreState {
  flags: FeatureFlag | null;
  setFlags: (flags: FeatureFlag) => void;
}

export const useFeatureFlagsStore = create<FeatureFlagsStoreState>((set) => ({
  flags: null,
  setFlags: (flags) =>
    set((state) => ({
      ...state,
      featureFlags: { ...state, flags },
    })),
}));
