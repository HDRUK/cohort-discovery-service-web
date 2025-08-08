import { create } from "zustand";
import type { RuleGroupType, RuleType } from "react-querybuilder";
import getQueryFromInput from "../actions/getQueryFromInput";
import submitQuery from "../actions/submitQuery";
import { ApiResponse, Collection, CreateQuery, Query } from "../types/api";
import { DEFAULT_SEXES, OmopTableName } from "@/types/omop";
import { baseFields } from "../config/queryFields";
import { Field, isRuleGroup } from "react-querybuilder";

type Option = {
  name: string;
  label: string;
};

export interface DaphneStoreState {
  stateManagement: {
    clearStates: () => void;
    isLoading: boolean;
    setIsLoading: (state: boolean) => void;
  };
  queryBuilder: {
    fields: Field[];
    setFields: (fields: Field[]) => void;
    queryBuilderJson: RuleGroupType;
    setQueryBuilderJson: (query: RuleGroupType) => void;
    getQueryFromText: (input: string) => void;
    selectedDatasets: string[];
    setSelectedDatasets: (pids: string[]) => void;
  };
  omop: {
    sexes: Option[];
    setSexes: (sexes: Option[]) => void;
    conditions: Option[];
    setConditions: (conditions: Option[]) => void;
    measurements: Option[];
    setMeasurements: (measurements: Option[]) => void;
    drugs: Option[];
    setDrugs: (drugs: Option[]) => void;
    observations: Option[];
    setObservations: (observations: Option[]) => void;
    procedures: Option[];
    setProcedures: (procedures: Option[]) => void;
    setOmop: (data: Record<OmopTableName, Option[]>) => void;
  };
  userData: {
    queries: Query[];
    setQueries: (queries: Query[]) => void;
    fetchResults: (reset: boolean) => Promise<ApiResponse<CreateQuery>>;
    collections: Collection[];
    setCollections: (collections: Collection[]) => void;
  };
}

export const DEFAULT_QUERY: RuleGroupType = {
  combinator: "and",
  rules: [
    { field: "age", operator: ">", value: 60 },
    { field: "condition", operator: "=", value: "201826" },
  ],
};

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
    const options =
      dataSources[
        query.field === "sex" ? `${query.field}es` : `${query.field}s`
      ];

    const match = query?.value
      ? findBestMatch(query.value, options)
      : undefined;

    return match ? { ...query, value: match.name } : query;
  }
}

export const useDaphneStore = create<DaphneStoreState>((set, get) => ({
  stateManagement: {
    isLoading: false,
    setIsLoading: (isLoading) =>
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading },
      })),
    clearStates: () =>
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading: false },
        queryBuilder: {
          ...state.queryBuilder,
          queryBuilderJson: DEFAULT_QUERY,
        },
      })),
  },

  queryBuilder: {
    fields: baseFields,
    setFields: (fields) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, fields },
      })),
    queryBuilderJson: DEFAULT_QUERY,
    setQueryBuilderJson: (query) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, queryBuilderJson: query },
      })),
    selectedDatasets: [],
    setSelectedDatasets: (pids) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, selectedDatasets: pids },
      })),
    getQueryFromText: async (input: string) => {
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading: true },
      }));

      const rawQuery = await getQueryFromInput(input);

      const normalised = normaliseQueryValues(rawQuery, {
        sexes: get().omop.sexes,
        conditions: get().omop.conditions,
        measurements: get().omop.measurements,
        observations: get().omop.observations,
        drugs: get().omop.drugs,
        procedures: get().omop.procedures,
      });

      const finalQueryBuilderJson = isRuleGroup(normalised)
        ? normalised
        : {
            combinator: "and",
            rules: [normalised],
          };

      get().queryBuilder.setQueryBuilderJson(finalQueryBuilderJson);
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading: false },
      }));
    },
  },

  omop: {
    sexes: DEFAULT_SEXES,
    setSexes: (sexes) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, sexes },
      })),
    conditions: [],
    setConditions: (conditions) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, conditions },
      })),
    measurements: [],
    setMeasurements: (measurements) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, measurements },
      })),
    drugs: [],
    setDrugs: (drugs) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, drugs },
      })),
    observations: [],
    setObservations: (observations) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, observations },
      })),
    procedures: [],
    setProcedures: (procedures) =>
      set((state) => ({
        ...state,
        omop: { ...state.omop, procedures },
      })),
    setOmop: (options) => {
      if (options?.sex) {
        get().omop.setSexes(options.sex);
      }
      if (options?.condition) {
        get().omop.setConditions(options.condition);
      }
      if (options?.observation) {
        get().omop.setObservations(options.observation);
      }
      if (options?.drug) {
        get().omop.setDrugs(options.drug);
      }
      if (options?.measurement) {
        get().omop.setMeasurements(options.measurement);
      }
      if (options?.procedure) {
        get().omop.setProcedures(options.procedure);
      }
    },
  },

  userData: {
    queries: [],
    setQueries: (queries) =>
      set((state) => ({
        ...state,
        userData: { ...state.userData, queries },
      })),
    fetchResults: async (reset = false) => {
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading: true },
      }));

      const { queryBuilderJson, selectedDatasets } = get().queryBuilder;
      const res = await submitQuery(queryBuilderJson, selectedDatasets);

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          ...(reset ? { queryBuilderJson: NO_QUERY } : {}),
        },
        stateManagement: { ...state.stateManagement, isLoading: false },
      }));

      return res;
    },
    collections: [],
    setCollections: (collections) =>
      set((state) => ({
        ...state,
        userData: { ...state.userData, collections },
      })),
  },
}));
