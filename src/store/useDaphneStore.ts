import { create } from "zustand";
import submitQuery from "@/actions/submitQuery";
import createCollectionHost from "@/actions/createCollectionHost";
import { revalidateAction } from "@/actions/revalidate";
import {
  ApiResponse,
  Collection,
  CombinedUser,
  CreateQuery,
  Query,
  Custodian,
  CreateCollectionPost,
  Concept,
  Paginated,
  CreateConceptSetPost,
  ConceptSet,
} from "@/types/api";
import createCollection from "@/actions/createCollection";
import createConceptSet from "@/actions/createConceptSet";
import getConcepts from "@/actions/getConcepts";
import attachConcepts from "@/actions/attachConcepts";
import detachConcepts from "@/actions/detachConcepts";
import deleteConceptSet from "@/actions/deleteConceptSet";
import { queryToText } from "@/utils/queryBuilder";

import {
  SizeCache,
  BoardIndex,
  RuleGroupType,
  RuleNodeType,
} from "@/types/rules";
import {
  buildIndexFromModel,
  createOperator,
  createRule,
  createRuleGroup,
  findById,
  isOperator,
  updateById,
  validateRuleTree,
} from "@/utils/rules";
import { UniqueIdentifier } from "@dnd-kit/core";
import { trueKeys } from "@/utils/numbers";
import { EXAMPLE_1, NO_QUERY } from "@/config/queryExamples";
import parseQuery from "@/actions/parseQuery";

export enum NodeKind {
  RULE = "RULE",
  GROUP = "GROUP",
  OPERATOR = "OPERATOR",
}

type NodeFactory = () => RuleNodeType;
export const Creators: Record<string, NodeFactory> = {
  [NodeKind.RULE]: createRule,
  [NodeKind.GROUP]: createRuleGroup,
  [NodeKind.OPERATOR]: createOperator,
};

const DEFAULT_QUERY: RuleGroupType =
  process.env.NEXT_PUBLIC_USE_EXAMPLE_QUERY === "true" ? EXAMPLE_1 : NO_QUERY;

export interface DaphneStoreState {
  stateManagement: {
    clearStates: () => void;
    isLoading: boolean;
    setIsLoading: (state: boolean) => void;
  };
  queryBuilder: {
    queryName: string;
    setQueryName: (name: string) => void;
    queryBuilderJson: RuleGroupType;
    setQueryBuilderJson: (query: RuleGroupType) => void;
    boardIndex: BoardIndex;
    sizeCache: SizeCache;
    setSizeCache: (
      id: UniqueIdentifier,
      width: number | string,
      height: number | string
    ) => void;
    selected: Record<UniqueIdentifier, boolean>;
    toggleSelected: (id: UniqueIdentifier) => void;
    createNewNode: (kind: NodeKind) => void;
    createNewRule: () => void;
    createNewGroup: () => void;
    createNewOperator: () => void;
    queryAsText: string;
    getQueryFromText: (input: string) => void;
    selectedDatasets: string[];
    setSelectedDatasets: (pids: string[]) => void;
  };
  userData: {
    user: CombinedUser | undefined | null;
    setUser: (user: CombinedUser) => void;
    queries: Query[];
    setQueries: (queries: Query[]) => void;
    fetchResults: (
      queryName?: string,
      reset?: boolean
    ) => Promise<ApiResponse<CreateQuery>>;
    collections: Collection[];
    setCollections: (collections: Collection[]) => void;
    conceptSets: ConceptSet[];
    setConceptSets: (conceptSets: ConceptSet[]) => void;
    createConceptSet: (payload: CreateConceptSetPost) => Promise<void>;
    searchForConcepts: (
      searchTerm: string,
      domain?: string
    ) => Promise<Paginated<Partial<Concept>[]>>;
    addConceptsToSet: (
      conceptSetId: number,
      conceptIds: number[]
    ) => Promise<void>;
    removeConceptsFromSet: (
      conceptSetId: number,
      conceptIds: number[]
    ) => Promise<void>;
    removeConceptSet: (conceptSetId: number) => Promise<void>;
  };
  custodianData: {
    custodians: Custodian[];
    setCustodians: (custodains: Custodian[]) => void;
    createCollectionHost: (
      custodianId: number,
      payload: { name: string; context: string }
    ) => Promise<void>;
    createCollection: (
      custodianPid: string,
      payload: CreateCollectionPost
    ) => Promise<void>;
  };
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
          queryName: "",
          queryBuilderJson: DEFAULT_QUERY,
        },
      })),
  },

  queryBuilder: {
    queryBuilderJson: validateRuleTree(DEFAULT_QUERY),
    boardIndex: buildIndexFromModel(DEFAULT_QUERY),
    sizeCache: {},
    setSizeCache: (id, width, height) =>
      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          sizeCache: {
            ...state.queryBuilder.sizeCache,
            [id]: { width, height },
          },
        },
      })),
    selected: {},
    toggleSelected: (id: UniqueIdentifier) => {
      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          selected: {
            ...state.queryBuilder.selected,
            [id]: !(state.queryBuilder.selected?.[id] ?? false),
          },
        },
      }));
    },
    createNewNode: (kind: NodeKind) => {
      const fn = Creators[kind];

      const {
        queryBuilder: { selected, queryBuilderJson, setQueryBuilderJson },
      } = get();

      const addAfter = trueKeys(selected);

      const normaliseAdditions = (
        leftNeighbor?: RuleNodeType
      ): RuleNodeType[] => {
        const produced = fn();
        const additions = Array.isArray(produced) ? produced : [produced];

        const leftIsOperator = !!leftNeighbor && isOperator(leftNeighbor);
        const firstIsOperator = isOperator(additions[0]);

        const needLeadingOperator =
          !!leftNeighbor && !leftIsOperator && !firstIsOperator;

        const skipFirstOperator = leftIsOperator && firstIsOperator;

        return [
          ...(needLeadingOperator ? [createOperator()] : []),
          ...(skipFirstOperator ? additions.slice(1) : additions),
        ];
      };

      if (addAfter.length > 0) {
        let updated = queryBuilderJson;

        for (const id of addAfter) {
          const leftNeighbor = findById(updated, id as string);
          const toInsert = normaliseAdditions(leftNeighbor);

          updated = updateById(updated, id as string, (node) => node, {
            node: toInsert,
            position: "after",
          });
        }

        setQueryBuilderJson(updated);
        return;
      }

      const lastNode =
        queryBuilderJson.rules[queryBuilderJson.rules.length - 1];
      const toAppend = normaliseAdditions(lastNode);

      const rules = [...queryBuilderJson.rules, ...toAppend];
      const updatedQuery = { ...queryBuilderJson, rules };

      setQueryBuilderJson(updatedQuery);
    },

    createNewRule: () => get().queryBuilder.createNewNode(NodeKind.RULE),
    createNewGroup: () => get().queryBuilder.createNewNode(NodeKind.GROUP),
    createNewOperator: () =>
      get().queryBuilder.createNewNode(NodeKind.OPERATOR),
    queryAsText: queryToText(DEFAULT_QUERY),
    setQueryBuilderJson: (query: RuleGroupType) => {
      const updatedQuery = validateRuleTree(query);

      const text = updatedQuery.valid ? queryToText(query) : "";

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          queryBuilderJson: updatedQuery,
          boardIndex: buildIndexFromModel(query),
          queryAsText: text,
        },
      }));
    },
    queryName: "",
    setQueryName: (name) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, queryName: name },
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

      const { data: newQueryString } = await parseQuery(input);
      const newQuery = JSON.parse(newQueryString);

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          queryBuilderJson: validateRuleTree(newQuery),
          boardIndex: buildIndexFromModel(newQuery),
          queryAsText: queryToText(newQuery),
        },
        stateManagement: { ...state.stateManagement, isLoading: false },
      }));
    },
  },
  userData: {
    queries: [],
    setQueries: (queries) =>
      set((state) => ({
        ...state,
        userData: { ...state.userData, queries },
      })),
    fetchResults: async (name, reset = false) => {
      set((state) => ({
        ...state,
        stateManagement: { ...state.stateManagement, isLoading: true },
      }));

      const { queryBuilderJson, queryAsText, selectedDatasets } =
        get().queryBuilder;
      const queryName = name ? name : queryAsText;

      if (get().queryBuilder.queryName !== queryName) {
        get().queryBuilder.setQueryName(queryName);
      }

      const res = await submitQuery(
        queryBuilderJson,
        queryName,
        selectedDatasets
      );

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          ...(reset ? { queryBuilderJson: DEFAULT_QUERY } : {}),
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
    user: null,
    setUser: (user: CombinedUser) => {
      set((state) => ({ ...state, userData: { ...state.userData, user } }));
    },
    conceptSets: [],
    setConceptSets: (conceptSets: ConceptSet[]) => {
      set((state) => ({
        ...state,
        userData: { ...state.userData, conceptSets },
      }));
    },
    createConceptSet: async (payload: CreateConceptSetPost) => {
      await createConceptSet(payload);
      // revalidate based on pid in the future... need to make a switch to pid
      await revalidateAction(`concept-sets`);
    },
    searchForConcepts: async (searchTerm: string, domain?: string) => {
      const { data } = await getConcepts(searchTerm, domain);
      return data;
    },
    addConceptsToSet: async (conceptSetId: number, conceptIds: number[]) => {
      await attachConcepts(conceptSetId, conceptIds);
      // do this based on the user key too, otherwise will get all?
      revalidateAction("concept-sets");
    },
    removeConceptsFromSet: async (
      conceptSetId: number,
      conceptIds: number[]
    ) => {
      await detachConcepts(conceptSetId, conceptIds);
      // do this based on the user key too, otherwise will get all?
      revalidateAction("concept-sets");
    },
    removeConceptSet: async (conceptSetId: number) => {
      await deleteConceptSet(conceptSetId);
      // do this based on the user key too, otherwise will get all?
      revalidateAction("concept-sets");
    },
  },

  custodianData: {
    custodians: [],
    setCustodians: (custodians) =>
      set((state) => ({
        ...state,
        custodianData: { ...state.custodianData, custodians },
      })),
    createCollectionHost: async (custodianId, payload) => {
      await createCollectionHost(custodianId, payload);
      // revalidate based on pid in the future... need to make a switch to pid
      await revalidateAction(`collection-hosts`);
    },
    createCollection: async (custodianPid, payload) => {
      // note: inconsistancy between using custodian Id and custodian Pid
      // - this is because the BE uses different endpoints:
      // - Route::post('/v1/collection_hosts'... (custodianId in the payload)
      // - Route::post('/v1/custodians/{custodianPid}/collections'...
      await createCollection(custodianPid, payload);
      await revalidateAction(`collections-${custodianPid}`);
    },
  },
}));
