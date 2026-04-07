"use client";

import { create } from "zustand";
import { FeatureFlag } from "@/types/features";
import getFeatureFlags from "@/actions/getFeatureFlags";
import updateFeatureFlag from "@/actions/admin/updateFeatureFlag";
import { TAG_FEATURE_FLAGS } from "@/config/tags";
import { revalidateAction } from "@/actions/revalidate";

export interface FeatureFlagsStoreState {
  flags: FeatureFlag | null;
  setFlags: (flags: FeatureFlag) => void;
  refreshFlags: () => Promise<void>;
  updateFlag: (name: string, enabled: boolean) => Promise<void>;
}

export const useFeatureFlagsStore = create<FeatureFlagsStoreState>(
  (set, get) => ({
    flags: null,

    setFlags: (flags) => set({ flags }),

    refreshFlags: async () => {
      const response = await getFeatureFlags();
      set({ flags: response.data });
    },

    updateFlag: async (name, enabled) => {
      await updateFeatureFlag(name, { enabled });
      revalidateAction(TAG_FEATURE_FLAGS);
      get().refreshFlags();
    },
  }),
);
