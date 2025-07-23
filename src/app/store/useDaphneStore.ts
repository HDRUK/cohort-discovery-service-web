import { create } from "zustand";
import getMyQueryAction from "../actions/getMyQueryAction";

export interface DaphneStoreState {
  query: any;
  getQuery: () => void;
  setQuery: (query: any) => void;
  clearStates: () => void;
}

const DEFAULT_QUERY = {
  combinator: "and",
  rules: [
    { field: "sex", operator: "=", value: "Male" },
    { field: "age", operator: "between", value: [0, 100] },
  ],
};

export const useDaphneStore = create<DaphneStoreState>((set, get) => ({
  query: DEFAULT_QUERY,
  setQuery: (query) => {
    set({ query });
  },
  getQuery: () => {
    /*
     set({
      loading: true,
      loadingStatus: 'Signing you out...'
    });
    */
    //    const { query } = get();
    //setLoading(true)
    getMyQueryAction().then((res) => {
      get().setQuery(res);
    });
    //setLoading(false);
  },
  clearStates: () => {
    set({
      query: DEFAULT_QUERY,
    });
  },
}));
