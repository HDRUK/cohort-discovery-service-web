import { create } from "zustand";
import type { RuleGroupType } from "react-querybuilder";

import getQueryFromInput from "../actions/getQueryFromInput";

export interface DaphneStoreState {
  query: RuleGroupType;
  getQuery: (input: string) => void;
  setQuery: (query: RuleGroupType) => void;
  clearStates: () => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

const DEFAULT_QUERY = {
  combinator: "and",
  rules: [
    { field: "sex", operator: "=", value: "Male" },
    { field: "age", operator: "between", value: [0, 100] },
  ],
};

export const useDaphneStore = create<DaphneStoreState>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading) => {
    set({ isLoading });
  },
  query: DEFAULT_QUERY,
  setQuery: (query) => {
    set({ query });
  },
  getQuery: (input) => {
    set({
      isLoading: true,
      //loadingStatus: 'Signing you out...'
    });

    //    const { query } = get();
    //setLoading(true)
    getQueryFromInput(input).then((res) => {
      get().setQuery(res);
      set({
        isLoading: false,
      });
    });
    //setLoading(false);
  },
  clearStates: () => {
    set({
      query: DEFAULT_QUERY,
      isLoading: false,
    });
  },
}));
