import { create } from "zustand";
import type { RuleGroupType } from "react-querybuilder";
import getQueryFromInput from "../actions/getQueryFromInput";
import getOmopConditions from "../actions/omop/getOmopConditions";
import submitQuery from "../actions/submitQuery";
import getTasks from "../actions/getTasks";
import getQueries from "../actions/getQueries";
import getQuery from "../actions/getQuery";
import { Query } from "../types/api";

type Option = {
  name: string;
  label: string;
};

export interface DaphneStoreState {
  query: RuleGroupType;
  conditions: Option[];
  getQuery: (input: string) => void;
  setQuery: (query: RuleGroupType) => void;
  clearStates: () => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setConditions: (options: Option[]) => void;
  getConditions: () => Promise<Option[]>;
  getOmopDefaults: () => void;
  getResults: () => void;
  getUserTasks: () => void;
  tasks: string[];
  queries: Query[];
  getUserQueries: () => void;
  getUserQuery: (pid: string) => void;
  hasIncomplete: boolean;
}

const DEFAULT_QUERY = {
  combinator: "and",
  rules: [
    { field: "sex", operator: "=", value: "8507" },
    { field: "age", operator: "between", value: [50, 100] },
  ],
};

export const useDaphneStore = create<DaphneStoreState>((set, get) => ({
  tasks: [],
  queries: [],
  conditions: [],
  isLoading: false,
  hasIncomplete: false,
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
  setConditions: (options: Option[]) => {
    set({ conditions: options });
  },
  getConditions: async () => {
    const res = await getOmopConditions();
    get().setConditions(res);
    return get().conditions;
  },
  getOmopDefaults: async () => {
    get().getConditions();
    //get().getObservations();
    //get().getMeasurements();
    //get().getDrugExposures();
  },
  getResults: async () => {
    submitQuery(get().query).then((res) => {
      const { data } = res;
      const pid = data.query_pid;
      get().getUserQuery(pid);
    });
  },
  getUserTasks: async () => {
    getTasks().then((res) => {
      set({ tasks: res.data });
    });
  },
  getUserQueries: async () => {
    getQueries().then((res) => {
      // hasIncomplete: res.hasIncomplete
      set({ queries: res.data });
    });
  },
  getUserQuery: async (pid: string) => {
    getQuery(pid).then((res) => {
      const { data: newQuery } = res;
      const existingQueries = get().queries;

      const updatedQueries = [
        newQuery,
        ...existingQueries.filter((q) => q.id !== newQuery.id),
      ];

      set({ queries: updatedQueries });
    });
  },
  clearStates: () => {
    set({
      query: DEFAULT_QUERY,
      isLoading: false,
    });
  },
}));
