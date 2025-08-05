import { create } from "zustand";
import type { RuleGroupType, RuleType } from "react-querybuilder";
import getQueryFromInput from "../actions/getQueryFromInput";

import submitQuery from "../actions/submitQuery";
import getTasks from "../actions/getTasks";
import getQueries from "../actions/getQueries";
import getQuery from "../actions/getQuery";
import { Collection, Query } from "../types/api";
import getCollections from "../actions/getCollections";
import { baseFields } from "../config/queryFields";
import { Field } from "react-querybuilder";
import getOmopConditions from "../actions/omop/getOmopConditions";
import getOmopMeasurements from "../actions/omop/getOmopMeasurements";
import getOmopObservations from "../actions/omop/getOmopObservations";
import getOmopDrugs from "../actions/omop/getOmopDrugs";
import getOmopProcedures from "../actions/omop/getOmopProcedures";

type Option = {
  name: string;
  label: string;
};

export interface DaphneStoreState {
  fields: Field[];
  queryBuilderJson: RuleGroupType;
  getQuery: (input: string) => void;
  setQueryBuilderJson: (query: RuleGroupType) => void;
  clearStates: () => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  getAndSetOmopData: (
    fieldName: string,
    fetchFn: () => Promise<Option[]>
  ) => Promise<Option[]>;
  sexs: Option[];
  getSexes: () => Promise<Option[]>;
  conditions: Option[];
  getConditions: () => Promise<Option[]>;
  measurements: Option[];
  getMeasurements: () => Promise<Option[]>;
  drugs: Option[];
  getDrugs: () => Promise<Option[]>;
  observations: Option[];
  getObservations: () => Promise<Option[]>;
  procedures: Option[];
  getProcedures: () => Promise<Option[]>;
  getOmopDefaults: () => void;
  getResults: () => void;
  getUserTasks: () => void;
  tasks: string[];
  queries: Query[];
  getUserQueries: () => void;
  getUserQuery: (pid: string) => void;
  hasIncomplete: boolean;
  collections: Collection[];
  getAllCollections: () => void;
}

export const DEFAULT_QUERY: RuleGroupType = {
  combinator: "and",
  rules: [
    { field: "age", operator: ">", value: 60 },
    { field: "condition", operator: "=", value: "201826" },
  ],
};

export const DEFAULT_SEXES: Option[] = [
  { name: "8507", label: "Male (8507)" },
  { name: "8532", label: "Female (8532)" },
  { name: "8551", label: "Other (8551)" },
];

const NO_QUERY: RuleGroupType = {
  combinator: "and",
  rules: [],
};

function findBestMatch(value: string, options: Option[]): Option | undefined {
  if (typeof value === "number") return undefined;
  const lowerValue = value?.toLowerCase();
  if (!lowerValue) return;

  let bestScore = -Infinity;
  let bestOption: Option | undefined;
  if (!options) return;
  for (const opt of options) {
    const label = opt.label.toLowerCase();

    let score = 0;
    if (label === lowerValue) {
      score = 100; // perfect match
    } else if (label.includes(lowerValue)) {
      score = 80 - (label.indexOf(lowerValue) ?? 0);
    } else {
      const commonChars = [...lowerValue].filter((char) =>
        label.includes(char)
      ).length;
      score = commonChars;
    }

    if (score > bestScore) {
      bestScore = score;
      bestOption = opt;
    }
  }

  return bestOption;
}

function normaliseQueryValues(
  query: RuleGroupType | RuleType,
  dataSources: Record<string, Option[]>
): RuleGroupType | RuleType {
  if ("rules" in query) {
    return {
      ...query,
      rules: query.rules.map((rule) => normaliseQueryValues(rule, dataSources)),
    };
  } else {
    const options = dataSources[`${query.field}s`];

    const match = query?.value
      ? findBestMatch(query.value, options)
      : undefined;

    return match ? { ...query, value: match.name } : query;
  }
}

export const useDaphneStore = create<DaphneStoreState>((set, get) => ({
  fields: baseFields,
  tasks: [],
  queries: [],
  sexs: DEFAULT_SEXES,
  conditions: [],
  measurements: [],
  collections: [],
  observations: [],
  drugs: [],
  procedures: [],
  isLoading: false,
  hasIncomplete: false,
  setIsLoading: (isLoading) => {
    set({ isLoading });
  },
  queryBuilderJson: DEFAULT_QUERY,
  setQueryBuilderJson: (queryBuilderJson) => {
    set({ queryBuilderJson });
  },
  getQuery: (input) => {
    set({
      isLoading: true,
      //loadingStatus: 'Signing you out...'
    });

    //    const { query } = get();
    //setLoading(true)
    getQueryFromInput(input).then((res) => {
      const normRes = normaliseQueryValues(res, {
        sexs: get().sexs,
        conditions: get().conditions,
        measurements: get().measurements,
        observations: get().observations,
        drugs: get().drugs,
        procedures: get().procedures,
      });

      get().setQueryBuilderJson(normRes ? normRes : res);
      set({
        isLoading: false,
      });
    });
    //setLoading(false);
  },
  getAndSetOmopData: async (
    fieldName: string,
    fetchFn: () => Promise<Option[]>
  ) => {
    const res = await fetchFn();
    set({ [`${fieldName}s`]: res });

    const updatedFields = get().fields.map((field) =>
      field.name === fieldName ? { ...field, values: res } : field
    );

    set({ fields: updatedFields });
    return updatedFields;
  },
  getSexes: async () => {
    const updatedFields = get().fields.map((field) =>
      field.name === "sex" ? { ...field, values: get().sexs } : field
    );
    set({ fields: updatedFields });
    return get().sexs;
  },
  getConditions: async () => {
    return get().getAndSetOmopData("condition", getOmopConditions);
  },
  getMeasurements: async () => {
    return get().getAndSetOmopData("measurement", getOmopMeasurements);
  },
  getObservations: async () => {
    return get().getAndSetOmopData("observation", getOmopObservations);
  },
  getDrugs: async () => {
    return get().getAndSetOmopData("drug", getOmopDrugs);
  },
  getProcedures: async () => {
    return get().getAndSetOmopData("procedure", getOmopProcedures);
  },
  getOmopDefaults: async () => {
    get().getSexes();
    get().getConditions();
    get().getObservations();
    get().getMeasurements();
    get().getDrugs();
    get().getProcedures();
  },
  getResults: async () => {
    set({
      isLoading: true,
    });

    submitQuery(get().queryBuilderJson).then((res) => {
      const { data } = res;
      const pid = data.query_pid;
      get().getUserQuery(pid);
      set({
        isLoading: false,
        queryBuilderJson: NO_QUERY,
      });
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
    const res = await getQuery(pid);
    const { data: newQuery } = res;
    const existingQueries = get().queries;

    const existingIndex = existingQueries.findIndex(
      (q) => q.id === newQuery.id
    );

    let updatedQueries;
    if (existingIndex !== -1) {
      updatedQueries = [...existingQueries];
      updatedQueries[existingIndex] = newQuery;
    } else {
      updatedQueries = [newQuery, ...existingQueries];
    }

    set({ queries: updatedQueries });
  },

  getAllCollections: async () => {
    getCollections().then((res) => set({ collections: res.data }));
  },
  clearStates: () => {
    set({
      queryBuilderJson: DEFAULT_QUERY,
      isLoading: false,
    });
  },
}));
