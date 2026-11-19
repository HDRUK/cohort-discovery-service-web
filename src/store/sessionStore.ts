"use client";

import { create } from "zustand";

export interface SessionStoreState {
  hasEnded: boolean;
  endSession: () => void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  hasEnded: false,
  endSession: () => set({ hasEnded: true }),
}));
