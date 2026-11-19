"use client";

import { create } from "zustand";

export interface SelectionStoreState {
  selectedUserId: string | null;
  setSelectedUserId: (selectedUserId: string | null) => void;
  selectedCollectionIds: string[];
  setSelectedCollectionIds: (selectedCollectionIds: string[]) => void;
}

export const useSelectionStore = create<SelectionStoreState>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  selectedCollectionIds: [],
  setSelectedCollectionIds: (selectedCollectionIds) =>
    set({ selectedCollectionIds }),
}));
