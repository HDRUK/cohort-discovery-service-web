"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AccessBannerStoreState {
  dismissed: boolean;
  dismiss: () => void;
}

/**
 * Whether the user has closed the access banner.
 *
 * Persisted to sessionStorage rather than localStorage so the dismissal dies
 * with the browser session — the banner is meant to reappear on the next sign
 * in, not be hidden forever.
 */
export const useAccessBannerStore = create<AccessBannerStoreState>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
    }),
    {
      name: "access-banner",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ dismissed: state.dismissed }),
    },
  ),
);
