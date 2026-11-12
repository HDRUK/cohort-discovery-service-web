"use client";

import { create } from "zustand";
import { FeatureFlag } from "@/types/features";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";

export interface FeatureFlagsStoreState {
  flags: FeatureFlag | null;
  setFlags: (flags: FeatureFlag) => void;
  updateFlag: (name: string, enabled: boolean) => Promise<void>;
}

export const useFeatureFlagsStore = create<FeatureFlagsStoreState>(
  (set, get) => {
    const setFlag = (name: string, enabled: boolean) => {
      const { flags } = get();
      if (flags) set({ flags: { ...flags, [name]: enabled } });
    };

    return {
      flags: null,

      setFlags: (flags) => set({ flags }),

      updateFlag: async (name, enabled) => {
        const previous = get().flags?.[name as keyof FeatureFlag];
        setFlag(name, enabled);
        try {
          await updateFeatureFlag(name, { enabled });
        } catch (error) {
          if (previous !== undefined) setFlag(name, previous);
          throw error;
        }
      },
    };
  },
);
