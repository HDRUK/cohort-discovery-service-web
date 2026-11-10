"use client";

import { create } from "zustand";
import { FeatureFlag } from "@/types/features";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";

export interface FeatureFlagsStoreState {
  flags: FeatureFlag | null;
  setFlags: (flags: FeatureFlag) => void;
  updateFlag: (name: string, enabled: boolean) => Promise<void>;
}

export const useFeatureFlagsStore = create<FeatureFlagsStoreState>((set) => ({
  flags: null,

  setFlags: (flags) => set({ flags }),

  updateFlag: async (name, enabled) => {
    await updateFeatureFlag(name, { enabled });
  },
}));
