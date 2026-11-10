"use client";

import { create } from "zustand";

export interface QueryLimitStoreState {
  isQueryLimitReached: boolean;
  markQueryLimitReached: () => void;
}

export const useQueryLimitStore = create<QueryLimitStoreState>((set) => ({
  isQueryLimitReached: false,
  markQueryLimitReached: () => set({ isQueryLimitReached: true }),
}));
