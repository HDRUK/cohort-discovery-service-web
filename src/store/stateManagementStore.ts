import { create } from "zustand";
import { useQueryBuilderStore, DEFAULT_QUERY } from "./queryBuilderStore";

export interface StateManagementStoreState {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  clearStates: () => void;
}

export const useStateManagementStore = create<StateManagementStoreState>(
  (set) => ({
    isLoading: false,
    setIsLoading: (isLoading) =>
      set((state) => ({
        ...state,
        stateManagement: { ...state, isLoading },
      })),
    clearStates: () => {
      set((state) => ({
        ...state,
        stateManagement: { ...state, isLoading: false },
      }));

      const qb = useQueryBuilderStore.getState();
      qb.setQueryName("");
      qb.setQueryBuilderJson(DEFAULT_QUERY);
    },
  }),
);
