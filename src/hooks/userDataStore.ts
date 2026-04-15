import { create } from "zustand";
import submitQuery from "@/actions/query/submitQuery";
import rerunTask from "@/actions/task/rerunTask";
import rerunDistributions from "@/actions/rerunDistributions";
import createConceptSet from "@/actions/conceptSet/createConceptSet";
import attachConcepts from "@/actions/concept/attachConcepts";
import detachConcepts from "@/actions/concept/detachConcepts";
import deleteConceptSet from "@/actions/conceptSet/deleteConceptSet";
import deleteQueries from "@/actions/query/deleteQueries";
import {
  revalidateAction,
  revalidateCustodian,
  revalidateUserAction,
} from "@/actions/revalidate";
import {
  ApiResponse,
  CombinedUser,
  CreateQuery,
  Query,
  Custodian,
  Concept,
  Paginated,
  CreateConceptSetPost,
  ConceptSet,
  DistributionType,
  CollectionWithHosts,
  Workgroup,
  Collection,
} from "@/types/api";
import {
  TAG_COLLECTIONS_ADMIN,
  TAG_CONCEPT_SETS,
  getUserQueryTag,
} from "@/config/tags";
import { DEFAULT_QUERY, useQueryBuilderStore } from "@/store/queryBuilderStore";
import { useCustodianDataStore } from "@/store/custodianDataStore";
import searchConcepts from "@/actions/concept/searchConcepts";
import { WorkgroupNames } from "@/config/workgroups";

export interface UserDataStoreState {
  user: CombinedUser | undefined | null;
  setUser: (user: CombinedUser | null) => void;
  isOnlyInDefaultWorkgroup: boolean;

  userCollections: Collection[];
  setUserCollections: (collections: Collection[]) => void;

  custodians: Custodian[];
  setCustodians: (custodians: Custodian[]) => void;

  queries: Query[];
  setQueries: (queries: Query[]) => void;

  fetchResults: (
    queryName?: string,
    reset?: boolean,
  ) => Promise<ApiResponse<CreateQuery>>;

  rerunTask: (id: string) => Promise<void>;

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

  deleteQueries: (pids: string[]) => Promise<void>;

  workgroups: Workgroup[];
  setWorkgroups: (workgroups: Workgroup[]) => void;
}

export const useUserDataStore = create<UserDataStoreState>((set) => ({
  user: null,
  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
      isOnlyInDefaultWorkgroup:
        (user?.workgroups?.length ?? 0) === 1 &&
        user?.workgroups?.[0]?.name === WorkgroupNames.DEFAULT,
    })),
  isOnlyInDefaultWorkgroup: false,
  userCollections: [],
  setUserCollections: (userCollections) =>
    set((state) => ({
      ...state,
      userCollections,
    })),

  custodians: [],
  setCustodians: (custodians) =>
    set((state) => ({
      ...state,
      custodians,
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
    await revalidateUserAction("queries");

    if (reset) {
      useQueryBuilderStore.getState().setQueryBuilderJson(DEFAULT_QUERY);
    }

    return res;
  },

  rerunTask: async (id) => {
    await rerunTask(id);
    const custodian = useCustodianDataStore.getState().current.custodian;
    if (custodian) revalidateCustodian(custodian);
  },

  selectedCollections: [],
  setSelectedCollections: (selectedCollections) =>
    set((state) => ({
      ...state,
      selectedCollections,
    })),

  runDistributions: async (collection, query_type) => {
    const { pid, custodian } = collection;
    const res = await rerunDistributions(pid, { query_type });

    revalidateCustodian(custodian);
    revalidateAction(TAG_COLLECTIONS_ADMIN);
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
    await revalidateUserAction(TAG_CONCEPT_SETS);
  },

  searchForConcepts: async ({ searchTerm, perPage, domain }) => {
    const { selectedDatasets } = useQueryBuilderStore.getState();

    const { data } = await searchConcepts({
      concept_name: [searchTerm],
      concept_id: [searchTerm],
      per_page: perPage,
      domain,
      collections: selectedDatasets,
    });

    return data;
  },

  addConceptsToSet: async (conceptSetId, conceptIds) => {
    await attachConcepts(conceptSetId, conceptIds);
    await revalidateUserAction(TAG_CONCEPT_SETS);
  },

  removeConceptsFromSet: async (conceptSetId, conceptIds) => {
    await detachConcepts(conceptSetId, conceptIds);
    await revalidateUserAction(TAG_CONCEPT_SETS);
  },

  removeConceptSet: async (conceptSetId) => {
    await deleteConceptSet(conceptSetId);
    await revalidateUserAction(TAG_CONCEPT_SETS);
  },

  deleteQueries: async (pids) => {
    await deleteQueries(pids);
    const user = useUserDataStore.getState().user;
    if (user) await revalidateAction(getUserQueryTag(user.id));
  },

  workgroups: [],
  setWorkgroups: (workgroups) =>
    set((state) => ({
      ...state,
      workgroups,
    })),
}));
