"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// add a key here to make something dismissible, nothing else is needed
export type DismissibleKey = "accessBanner";

export interface UiPreferencesState {
  dismissed: Partial<Record<DismissibleKey, boolean>>;
  dismiss: (key: DismissibleKey) => void;
}

export const useUiPreferences = create<UiPreferencesState>()(
  persist(
    (set) => ({
      dismissed: {},
      dismiss: (key) =>
        set((state) => ({ dismissed: { ...state.dismissed, [key]: true } })),
    }),
    {
      name: "ui-preferences",
      // sessionStorage so dismissals clear when the tab closes
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ dismissed: state.dismissed }),
    },
  ),
);
