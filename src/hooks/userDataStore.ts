import { create } from "zustand";
import submitQuery from "@/actions/query/submitQuery";
import rerunDistributions from "@/actions/rerunDistributions";
import createConceptSet from "@/actions/conceptSet/createConceptSet";
import attachConcepts from "@/actions/concept/attachConcepts";
import detachConcepts from "@/actions/concept/detachConcepts";
import deleteConceptSet from "@/actions/conceptSet/deleteConceptSet";
import {
  ApiResponse,
  CreateQuery,
  Query,
  Concept,
  Paginated,
  CreateConceptSetPost,
  ConceptSet,
  DistributionType,
  CollectionWithHosts,
  SearchConceptsBody,
} from "@/types/api";
import { DEFAULT_QUERY, useQueryBuilderStore } from "@/store/queryBuilderStore";
import { routes } from "@/config/routes";
import { routePost } from "@/lib/routeFetch";

export interface UserDataStoreState {
  isQueryLimitReached: boolean;
  markQueryLimitReached: () => void;

  queries: Query[];
  setQueries: (queries: Query[]) => void;

  fetchResults: (
    queryName?: string,
    reset?: boolean,
  ) => Promise<ApiResponse<CreateQuery>>;

  selectedCollections: CollectionWithHosts[] | [];
  setSelectedCollections: (collections: CollectionWithHosts[] | []) => void;

  runDistributions: (
    collection: CollectionWithHosts,
    query_type: DistributionType,
  ) => Promise<Query>;

  conceptSets: ConceptSet[];
  setConceptSets: (conceptSets: ConceptSet[]) => void;

  createConceptSet: (payload: CreateConceptSetPost) => Promise<void>;

  searchForConcepts: (args: {
    selectedDatasets?: string[];
    searchTerm: string;
    perPage: number;
    page?: number;
    domain?: string;
  }) => Promise<Paginated<Partial<Concept>>>;

  addConceptsToSet: (
    conceptSetId: number,
    conceptIds: number[],
  ) => Promise<void>;
  removeConceptsFromSet: (
    conceptSetId: number,
    conceptIds: number[],
  ) => Promise<void>;
  removeConceptSet: (conceptSetId: number) => Promise<void>;
}

export const useUserDataStore = create<UserDataStoreState>((set) => ({
  isQueryLimitReached: false,
  markQueryLimitReached: () =>
    set((state) => ({
      ...state,
      isQueryLimitReached: true,
    })),

  queries: [],
  setQueries: (queries) =>
    set((state) => ({
      ...state,
      queries,
    })),

  fetchResults: async (name, reset = false) => {
    const { queryBuilderJson, selectedDatasets } =
      useQueryBuilderStore.getState();
    const queryName = name ? name : null;

    const res = await submitQuery(
      queryBuilderJson,
      queryName,
      selectedDatasets,
    );

    if (reset) {
      useQueryBuilderStore.getState().setQueryBuilderJson(DEFAULT_QUERY);
    }

    return res;
  },

  selectedCollections: [],
  setSelectedCollections: (selectedCollections) =>
    set((state) => ({
      ...state,
      selectedCollections,
    })),

  runDistributions: async (collection, query_type) => {
    const res = await rerunDistributions(collection.pid, { query_type });
    return res.data;
  },

  conceptSets: [],
  setConceptSets: (conceptSets) =>
    set((state) => ({
      ...state,
      conceptSets,
    })),

  createConceptSet: async (payload) => {
    await createConceptSet(payload);
  },

  searchForConcepts: async ({ searchTerm, perPage, page = 1, domain }) => {
    const { selectedDatasets } = useQueryBuilderStore.getState();

    const { data } = await routePost<
      ApiResponse<Paginated<Partial<Concept>>>,
      SearchConceptsBody
    >(routes.api.conceptSearch, {
      concept_name: [searchTerm],
      concept_id: [searchTerm],
      per_page: perPage,
      page,
      domain,
      collections: selectedDatasets,
    });

    return data;
  },

  addConceptsToSet: async (conceptSetId, conceptIds) => {
    await attachConcepts(conceptSetId, conceptIds);
  },

  removeConceptsFromSet: async (conceptSetId, conceptIds) => {
    await detachConcepts(conceptSetId, conceptIds);
  },

  removeConceptSet: async (conceptSetId) => {
    await deleteConceptSet(conceptSetId);
  },
}));
