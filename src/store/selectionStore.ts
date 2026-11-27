"use client";

import { create } from "zustand";

export interface SelectionStoreState {
  selectedUserId: string | null;
  setSelectedUserId: (selectedUserId: string | null) => void;
  selectedUserIds: string[];
  setSelectedUserIds: (selectedUserIds: string[]) => void;
  selectedCollectionIds: string[];
  setSelectedCollectionIds: (selectedCollectionIds: string[]) => void;
}

export const useSelectionStore = create<SelectionStoreState>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  selectedUserIds: [],
  setSelectedUserIds: (selectedUserIds) => set({ selectedUserIds }),
  selectedCollectionIds: [],
  setSelectedCollectionIds: (selectedCollectionIds) =>
    set({ selectedCollectionIds }),
}));
