import { create } from "zustand";
import getMyQueryAction from "../actions/getMyQueryAction";

export interface DaphneStoreState {
  query: any;
  getQuery: (query: any) => void;
  setQuery: (query: any) => void;
  clearStates: () => void;
}

const DEFAULT_QUERY = {
  combinator: "and",
  rules: [
    { field: "firstName", operator: "=", value: "Steve" },
    { field: "lastName", operator: "ends", value: "Vai" },
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
    const { query } = get();
    //setLoading(true)
    getMyQueryAction(query).then(() => {});
    //setLoading(false);
  },
  clearStates: () => {
    set({
      query: DEFAULT_QUERY,
    });
  },
}));
