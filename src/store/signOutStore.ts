"use client";

import { create } from "zustand";

export interface SignOutStoreState {
  isSigningOut: boolean;
  setSigningOut: (isSigningOut: boolean) => void;
}

export const useSignOutStore = create<SignOutStoreState>((set) => ({
  isSigningOut: false,
  setSigningOut: (isSigningOut) => set({ isSigningOut }),
}));
