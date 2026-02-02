import { create } from "zustand";
import submitQuery from "@/actions/submitQuery";
import createCollectionHost from "@/actions/createCollectionHost";
import updateCollectionHost from "@/actions/updateCollectionHost";
import deleteCollectionHost from "@/actions/deleteCollectionHost";
import {
  revalidateAction,
  revalidateCustodian,
  revalidateUserAction,
} from "@/actions/revalidate";
import {
  ApiResponse,
  Collection,
  CombinedUser,
  CreateQuery,
  Query,
  Custodian,
  CreateCollectionPost,
  UpdateCollectionPayload,
  Concept,
  Paginated,
  CreateConceptSetPost,
  ConceptSet,
  UpdateCollectionHostPayload,
  CreateCollectionConfigPost,
  FeatureFlag,
  FeatureName,
  DistributionType,
  CollectionWithHosts,
  Workgroup,
  CreateWorkgroupPost,
  AddCollectionsToWorkgroupPost,
  RemoveCollectionsFromWorkgroupPost,
  AddCollectionToWorkgroupsPost,
  RemoveCollectionFromWorkgroupsPost,
} from "@/types/api";
import createCollection from "@/actions/createCollection";
import deleteCollection from "@/actions/deleteCollection";
import createConceptSet from "@/actions/createConceptSet";
import getConcepts from "@/actions/getConcepts";
import attachConcepts from "@/actions/attachConcepts";
import detachConcepts from "@/actions/detachConcepts";
import deleteConceptSet from "@/actions/deleteConceptSet";
import deleteQueries from "@/actions/deleteQueries";

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
  createAgeFilter,
  createRule,
  createRuleGroup,
  findById,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  updateById,
  validateRuleTree,
  isAgeFilter,
  groupToRules,
} from "@/utils/rules";
import { UniqueIdentifier } from "@dnd-kit/core";
import { removeFalseKeys, trueKeys } from "@/utils/numbers";
import { EXAMPLE_1, NO_QUERY } from "@/config/queryExamples";
import parseQuery from "@/actions/parseQuery";
import createCollectionConfig from "@/actions/createCollectionConfig";
import updateCollection from "@/actions/updateCollection";
import updateCollectionConfig from "@/actions/updateCollectionConfig";
import createCustodianCollection from "@/actions/createCustodianCollection";
import rerunTask from "@/actions/rerunTask";
import rerunDistributions from "@/actions/rerunDistributions";
import createWorkgroup from "@/actions/createWorkgroup";
import addCollectionsToWorkgroup from "@/actions/addCollectionsToWorkgroup";
import removeCollectionsFromWorkgroup from "@/actions/removeCollectionsFromWorkgroup";
import {
  getCollectionHostTag,
  getTagCustodianCollection,
  getUserQueryTag,
  TAG_COLLECTION_ADMIN,
  TAG_COLLECTION_HOSTS,
  TAG_COLLECTIONS,
  TAG_CONCEPT_SETS,
  TAG_WORKGROUP_ADMIN,
} from "@/config/tags";
import addCollectionToWorkgroups from "@/actions/addCollectionToWorkgroups";
import removeCollectionFromWorkgroups from "@/actions/removeCollectionFromWorkgroups";
import { DatasetErrors } from "@/utils/datasets";

export enum NodeKind {
  RULE = "RULE",
  GROUP = "GROUP",
  OPERATOR = "OPERATOR",
  AGE_FILTER = "AGE_FILTER",
}

type NodeFactory = () => RuleNodeType;
export const Creators: Record<string, NodeFactory> = {
  [NodeKind.RULE]: createRule,
  [NodeKind.GROUP]: createRuleGroup,
  [NodeKind.OPERATOR]: createOperator,
  [NodeKind.AGE_FILTER]: createAgeFilter,
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
    setQueryBuilderJson: (
      query: RuleGroupType,
      validate?: boolean,
    ) => RuleGroupType;
    resetQueryBuilderJson: (resetQueryName?: boolean) => void;
    errors: string[];
    setErrors: (rules: RuleGroupType, pids: UniqueIdentifier[]) => void;
    appendError: (error: string) => void;
    getNodeName: (node: RuleNodeType) => string;
    setNodeName: (node: RuleNodeType, name: string) => void;
    boardIndex: BoardIndex;
    sizeCache: SizeCache;
    setSizeCache: (
      id: UniqueIdentifier,
      width: number | string,
      height: number | string,
    ) => void;
    hovered: Record<UniqueIdentifier, boolean>;
    setHovered: (id: UniqueIdentifier, reset?: boolean) => void;
    selected: Record<UniqueIdentifier, boolean>;
    setSelected: (
      id: UniqueIdentifier | UniqueIdentifier[],
      next?: boolean,
      reset?: boolean,
    ) => void;
    select: (id: UniqueIdentifier | UniqueIdentifier[]) => void;
    deselect: (id: UniqueIdentifier | UniqueIdentifier[]) => void;
    toggleSelected: (id: UniqueIdentifier, reset?: boolean) => void;
    createNewNode: (kind: NodeKind, above?: boolean) => void;
    createNewRule: (above?: boolean) => void;
    createNewGroup: (above?: boolean) => void;
    createNewOperator: (above?: boolean) => void;
    createNewAgeFilter: (above?: boolean) => void;
    queryAsText: string;
    getQueryFromText: (input: string) => Promise<RuleGroupType>;
    selectedDatasets: string[];
    setSelectedDatasets: (pids: string[]) => void;
    openSelectDatasetsPanel: boolean;
    setOpenSelectDatasetsPanel: (value: boolean) => void;
    showDescendants: Record<UniqueIdentifier, boolean>;
    setShowDescendants: (
      id: UniqueIdentifier | UniqueIdentifier[],
      next?: boolean,
    ) => void;
    validateRules: (root: RuleGroupType) => RuleGroupType;
  };
  userData: {
    user: CombinedUser | undefined | null;
    setUser: (user: CombinedUser | null) => void;
    queries: Query[];
    setQueries: (queries: Query[]) => void;
    fetchResults: (
      queryName?: string,
      reset?: boolean,
    ) => Promise<ApiResponse<CreateQuery>>;
    rerunTask: (id: string) => void;
    collections: Collection[];
    setCollections: (collections: Collection[]) => void;
    selectedCollections: CollectionWithHosts[] | [];
    setSelectedCollections: (collections: CollectionWithHosts[] | []) => void;
    runDistributions: (
      collection: CollectionWithHosts,
      query_type: DistributionType,
    ) => Promise<Query>;
    conceptSets: ConceptSet[];
    setConceptSets: (conceptSets: ConceptSet[]) => void;
    createConceptSet: (payload: CreateConceptSetPost) => Promise<void>;
    searchForConcepts: (
      searchTerm: string,
      domain?: string,
    ) => Promise<Paginated<Partial<Concept>[]>>;
    addConceptsToSet: (
      conceptSetId: number,
      conceptIds: number[],
    ) => Promise<void>;
    removeConceptsFromSet: (
      conceptSetId: number,
      conceptIds: number[],
    ) => Promise<void>;
    removeConceptSet: (conceptSetId: number) => Promise<void>;
    deleteQueries: (pids: string[]) => void;
  };
  custodianData: {
    currentCustodian: Custodian | null;
    setCurrentCustodian: (custodian: Custodian | null) => void;
    custodians: Custodian[];
    setCustodians: (custodians: Custodian[]) => void;
    createCollectionHost: (
      custodianId: number,
      payload: { name: string; context: string },
    ) => Promise<void>;
    updateCollectionHost: (
      id: number,
      payload: UpdateCollectionHostPayload,
    ) => Promise<void>;
    deleteCollectionHost: (id: number) => Promise<void>;
    createCollection: (
      custodianPid: string,
      payload: CreateCollectionPost,
      payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
    ) => Promise<Collection>;
    updateCollection: (
      id: number,
      payload: Partial<CreateCollectionPost>,
      payloadConfig: Partial<CreateCollectionConfigPost>,
    ) => Promise<Collection>;
    deleteCollection: (
      id: number | string,
      custodianPid: string,
    ) => Promise<void>;
    workgroups: Workgroup[];
    setWorkgroups: (workgroups: Workgroup[]) => void;
  };
  adminData: {
    collections: Collection[];
    setCollections: (collections: Collection[]) => void;
    createCollection: (
      payload: CreateCollectionPost,
      payloadConfig: Omit<CreateCollectionConfigPost, "collection_id">,
    ) => Promise<Collection>;
    updateCollection: (
      id: number,
      payload: UpdateCollectionPayload,
      payloadConfig: Partial<CreateCollectionConfigPost>,
    ) => Promise<Collection>;
    deleteCollection: (id: number | string) => Promise<void>;
    createWorkgroup: (payload: CreateWorkgroupPost) => Promise<Workgroup>;
    addCollectionsToWorkgroup: (
      payload: AddCollectionsToWorkgroupPost,
    ) => Promise<number[]>;
    removeCollectionsFromWorkgroup: (
      payload: RemoveCollectionsFromWorkgroupPost,
    ) => Promise<void>;
    addCollectionToWorkgroups: (
      payload: AddCollectionToWorkgroupsPost,
    ) => Promise<number[]>;
    removeCollectionFromWorkgroups: (
      payload: RemoveCollectionFromWorkgroupsPost,
    ) => Promise<void>;
    selectedWorkgroup: Workgroup | null;
    setSelectedWorkgroup: (workgroup: Workgroup | null) => void;
  };
  featureFlags: {
    flags: FeatureFlag | null;
    setFlags: (flags: FeatureFlag) => void;
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
    resetQueryBuilderJson: (resetQueryName?: boolean) => {
      const {
        queryBuilder: { setQueryBuilderJson },
      } = get();
      setQueryBuilderJson(DEFAULT_QUERY);

      set((state) => {
        return {
          ...state,
          queryBuilder: {
            ...state.queryBuilder,
            selected: {},
            ...(resetQueryName ? { queryName: "" } : {}),
          },
        };
      });
    },
    errors: [],
    setErrors: (queryBuilderJson, selectedDatasets) => {
      const datasetsAreSelected = selectedDatasets.length > 0;
      const datasetReasons = datasetsAreSelected
        ? []
        : [DatasetErrors.NO_DATASETS];
      const qbReasons = queryBuilderJson.invalidReason ?? [];
      const errors = [...datasetReasons, ...qbReasons];

      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, errors },
      }));
    },
    appendError: (error) =>
      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          errors: [...state.queryBuilder.errors, error],
        },
      })),
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
    hovered: {},
    setHovered: async (id: UniqueIdentifier, reset: boolean = false) => {
      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          hovered: { [id]: !reset },
        },
      }));
    },
    selected: {},
    setSelected: async (
      id: UniqueIdentifier | UniqueIdentifier[],
      nextValue: boolean = true,
      reset: boolean = false,
    ) => {
      const ids = Array.isArray(id) ? id : [id];
      const uniqueIds = Array.from(new Set(ids));

      set((state) => {
        const curr = reset ? {} : (state.queryBuilder.selected ?? {});
        let changed = false;

        const nextSelected = { ...curr };

        for (const key of uniqueIds) {
          if (curr[key] !== nextValue) {
            nextSelected[key] = nextValue;
            changed = true;
          }
        }

        if (!changed) return state;

        return {
          ...state,
          queryBuilder: {
            ...state.queryBuilder,
            selected: nextSelected,
          },
        };
      });
    },
    select: async (id: UniqueIdentifier | UniqueIdentifier[]) =>
      get().queryBuilder.setSelected(id, true),
    deselect: (id: UniqueIdentifier | UniqueIdentifier[]) =>
      get().queryBuilder.setSelected(id, false),
    toggleSelected: (id: UniqueIdentifier, reset = true) => {
      set((state) => {
        const prevSelected = state.queryBuilder.selected ?? {};
        const isAlreadySelected = state.queryBuilder.selected?.[id] === true;

        return {
          ...state,
          queryBuilder: {
            ...state.queryBuilder,
            selected: {
              ...(reset
                ? isAlreadySelected
                  ? removeFalseKeys(prevSelected)
                  : {}
                : state.queryBuilder.selected),
              [id]: !(state.queryBuilder.selected?.[id] ?? false),
            },
          },
        };
      });
    },
    createNewNode: (kind: NodeKind, above: boolean = true) => {
      const fn = Creators[kind];

      const {
        queryBuilder: {
          selected,
          queryBuilderJson,
          setQueryBuilderJson,
          setSelected,
          boardIndex,
        },
      } = get();

      const idsToAddTo = trueKeys(selected);
      const allIds = Object.entries(boardIndex.itemsByGroup).flatMap(
        ([k, v]) => [k, ...v],
      );
      const allSet = new Set(allIds);
      const validIdsToAddTo = idsToAddTo.filter((id) =>
        allSet.has(id as string),
      );

      const normaliseAdditions = (
        belowNeighbor?: RuleNodeType,
      ): RuleNodeType[] => {
        const produced = fn();
        const additions = Array.isArray(produced) ? produced : [produced];

        const belowIsOperator = !!belowNeighbor && isOperator(belowNeighbor);
        const firstIsOperator = isOperator(additions[0]);

        const needLeadingOperator =
          !!belowNeighbor && !belowIsOperator && !firstIsOperator;

        const skipFirstOperator = belowIsOperator && firstIsOperator;

        return [
          ...(needLeadingOperator ? [createOperator()] : []),
          ...(skipFirstOperator ? additions.slice(1) : additions),
        ];
      };

      if (validIdsToAddTo.length > 0) {
        let updated = queryBuilderJson;

        for (const id of validIdsToAddTo) {
          const leftNeighbor = findById(updated, id as string);
          const toInsert = normaliseAdditions(leftNeighbor);
          setSelected(toInsert[above ? toInsert.length - 1 : 0].id, true, true);

          updated = updateById(updated, id as string, (node) => node, {
            node: above ? toInsert.reverse() : toInsert,
            position: above ? "before" : "after",
          });
        }

        setQueryBuilderJson(updated);
        return;
      }

      const lastNode =
        queryBuilderJson.rules[queryBuilderJson.rules.length - 1];
      const toAppend = normaliseAdditions(lastNode);

      const rules = above
        ? [...toAppend.reverse(), ...queryBuilderJson.rules]
        : [...queryBuilderJson.rules, ...toAppend];
      const updatedQuery = { ...queryBuilderJson, rules };
      setSelected(
        toAppend.slice(0, 1).map((r) => r.id),
        true,
        true,
      );
      setQueryBuilderJson(updatedQuery);
    },

    createNewRule: (above: boolean = true) =>
      get().queryBuilder.createNewNode(NodeKind.RULE, above),
    createNewGroup: (above: boolean = true) =>
      get().queryBuilder.createNewNode(NodeKind.GROUP, above),
    createNewOperator: (above: boolean = true) =>
      get().queryBuilder.createNewNode(NodeKind.OPERATOR, above),
    createNewAgeFilter: (above: boolean = true) =>
      get().queryBuilder.createNewNode(NodeKind.AGE_FILTER, above),
    queryAsText: queryToText(DEFAULT_QUERY),
    setQueryBuilderJson: (query: RuleGroupType, validate = true) => {
      const updatedQuery = validate
        ? get().queryBuilder.validateRules(query)
        : query;
      const text = updatedQuery.valid ? queryToText(query) : "";

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          queryBuilderJson: updatedQuery,
          boardIndex: buildIndexFromModel(updatedQuery),
          ...(validate ? { queryAsText: text } : {}),
        },
      }));

      get().queryBuilder.setErrors(
        updatedQuery,
        get().queryBuilder.selectedDatasets,
      );
      return updatedQuery;
    },
    getNodeName: (node: RuleNodeType) => {
      if (node.name) return node.name;
      let name = "";
      if (!isAgeFilter(node) && node.exclude) {
        name = "Excluded ";
      }

      if (isRuleGroup(node)) name += "Group";
      else if (isRuleLeaf(node)) {
        const c = node.rule?.concept;
        const category = Array.isArray(c) ? c[0]?.category : c?.category;
        name += `${category ?? "Blank"} rule`.trim();
      } else if (isOperator(node)) {
        name += `${node.combinator.toUpperCase()} operator`;
      } else if (isAgeFilter(node)) {
        name += "Age Filter";
      } else name += "Unknown";
      return name;
    },
    setNodeName: (node: RuleNodeType, name: string) => {
      get().queryBuilder.setQueryBuilderJson(
        updateById(get().queryBuilder.queryBuilderJson, node.id, (target) => ({
          ...target,
          name,
        })),
      );
    },
    queryName: "",
    setQueryName: (name) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, queryName: name },
      })),
    selectedDatasets: [],
    setSelectedDatasets: (pids) => {
      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          selectedDatasets: pids,
        },
      }));
      get().queryBuilder.setErrors(get().queryBuilder.queryBuilderJson, pids);
    },
    openSelectDatasetsPanel: false,
    setOpenSelectDatasetsPanel: (value) =>
      set((state) => ({
        ...state,
        queryBuilder: { ...state.queryBuilder, openSelectDatasetsPanel: value },
      })),
    showDescendants: {},
    setShowDescendants: async (
      id: UniqueIdentifier | UniqueIdentifier[],
      nextValue: boolean = true,
    ) => {
      const ids = Array.isArray(id) ? id : [id];
      const uniqueIds = Array.from(new Set(ids));

      set((state) => {
        const curr = state.queryBuilder.showDescendants ?? {};
        let changed = false;

        const next = { ...curr };

        for (const key of uniqueIds) {
          if (curr[key] !== nextValue) {
            next[key] = nextValue;
            changed = true;
          }
        }

        if (!changed) return state;

        return {
          ...state,
          queryBuilder: {
            ...state.queryBuilder,
            showDescendants: next,
          },
        };
      });
    },
    getQueryFromText: async (input: string) => {
      const cleanQuery = (queryString: string) => {
        const query = JSON.parse(queryString) as RuleGroupType;
        //enforce no unnecessary group within group
        if (query.rules.length === 1 && isRuleGroup(query.rules[0])) {
          return { ...query, rules: groupToRules(query.rules[0]) };
        }
        return query;
      };

      const { data: newQueryString } = await parseQuery(input);
      const newQuery = cleanQuery(newQueryString);
      const cleanedQuery = get().queryBuilder.setQueryBuilderJson(newQuery);
      return cleanedQuery;
    },
    validateRules: (root: RuleGroupType) => {
      const featureFlags = get().featureFlags.flags;

      return validateRuleTree(root, {
        constrainForBunnyV1:
          featureFlags?.[FeatureName.ConstrainForBunnyV1] || false,
      });
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
      const { queryBuilderJson, selectedDatasets } = get().queryBuilder;
      const queryName = name ? name : null;

      const res = await submitQuery(
        queryBuilderJson,
        queryName,
        selectedDatasets,
      );

      await revalidateUserAction("queries");

      set((state) => ({
        ...state,
        queryBuilder: {
          ...state.queryBuilder,
          ...(reset ? { queryBuilderJson: DEFAULT_QUERY } : {}),
        },
      }));

      return res;
    },
    rerunTask: async (id) => {
      await rerunTask(id);
      const custodian = get().custodianData.currentCustodian;
      if (custodian) {
        revalidateCustodian(custodian);
      }
    },
    collections: [],
    setCollections: (collections) =>
      set((state) => ({
        ...state,
        userData: { ...state.userData, collections },
      })),
    selectedCollections: [],
    setSelectedCollections: (selectedCollections: CollectionWithHosts[]) =>
      set((state) => ({
        ...state,
        userData: { ...state.userData, selectedCollections },
      })),
    runDistributions: async (
      collection: CollectionWithHosts,
      query_type: DistributionType,
    ) => {
      const { pid, custodian } = collection;
      const res = await rerunDistributions(pid, { query_type });

      revalidateCustodian(custodian);
      revalidateAction(TAG_COLLECTION_ADMIN); // for admin
      return res.data;
    },
    user: null,
    setUser: (user: CombinedUser | null) => {
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
      await revalidateUserAction(TAG_CONCEPT_SETS);
    },
    searchForConcepts: async (searchTerm: string, domain?: string) => {
      const { data } = await getConcepts(searchTerm, domain);
      return data;
    },
    addConceptsToSet: async (conceptSetId: number, conceptIds: number[]) => {
      await attachConcepts(conceptSetId, conceptIds);
      await revalidateUserAction(TAG_CONCEPT_SETS);
    },
    removeConceptsFromSet: async (
      conceptSetId: number,
      conceptIds: number[],
    ) => {
      await detachConcepts(conceptSetId, conceptIds);
      await revalidateUserAction(TAG_CONCEPT_SETS);
    },
    removeConceptSet: async (conceptSetId: number) => {
      await deleteConceptSet(conceptSetId);
      await revalidateUserAction(TAG_CONCEPT_SETS);
    },
    deleteQueries: async (pids) => {
      await deleteQueries(pids);
      const user = get().userData.user;
      if (user) {
        await revalidateAction(getUserQueryTag(user.id));
      }
    },
  },
  custodianData: {
    currentCustodian: null,
    setCurrentCustodian: (custodian: Custodian | null) =>
      set((state) => ({
        ...state,
        custodianData: { ...state.custodianData, currentCustodian: custodian },
      })),
    custodians: [],
    setCustodians: (custodians) =>
      set((state) => ({
        ...state,
        custodianData: { ...state.custodianData, custodians },
      })),
    createCollectionHost: async (custodianId, payload) => {
      await createCollectionHost(custodianId, payload);
      const currentCustodian = get().custodianData.currentCustodian;
      if (currentCustodian?.id === custodianId) {
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
      }
    },
    updateCollectionHost: async (id, payload) => {
      await updateCollectionHost(id, payload);
      const currentCustodian = get().custodianData.currentCustodian;
      await revalidateAction(TAG_COLLECTION_HOSTS);
      if (currentCustodian)
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));
    },
    deleteCollectionHost: async (id) => {
      await deleteCollectionHost(id);
      const currentCustodian = get().custodianData.currentCustodian;
      if (currentCustodian)
        await revalidateAction(getCollectionHostTag(currentCustodian.pid));

      await revalidateAction(TAG_COLLECTION_HOSTS);
    },
    createCollection: async (custodianPid, payload, payloadConfig) => {
      // note: inconsistancy between using custodian Id and custodian Pid
      // - this is because the BE uses different endpoints:
      // - Route::post('/v1/collection_hosts'... (custodianId in the payload)
      // - Route::post('/v1/custodians/{custodianPid}/collections'...
      const { data } = await createCustodianCollection(custodianPid, payload);

      await createCollectionConfig({
        ...payloadConfig,
        collection_id: data.id,
      });

      await revalidateAction(getTagCustodianCollection(custodianPid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);
      return data;
    },
    updateCollection: async (id, payload, payloadConfig) => {
      const { data } = await updateCollection(id, payload);

      const idConfig = data.config.id;
      await updateCollectionConfig(idConfig, payloadConfig);

      await revalidateAction(getTagCustodianCollection(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);
      return data;
    },
    deleteCollection: async (id, custodianPid) => {
      await deleteCollection(id);
      await revalidateAction(getTagCustodianCollection(custodianPid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
    },
    workgroups: [],
    setWorkgroups: (workgroups) =>
      set((state) => ({
        ...state,
        custodianData: { ...state.custodianData, workgroups },
      })),
  },
  adminData: {
    collections: [],
    setCollections: (collections: Collection[]) =>
      set((state) => ({
        ...state,
        adminData: { ...state.adminData, collections },
      })),
    createCollection: async (payload, payloadConfig) => {
      const { data } = await createCollection(payload);
      await createCollectionConfig({
        ...payloadConfig,
        collection_id: data.id,
      });

      await revalidateAction(getTagCustodianCollection(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);
      return data;
    },
    updateCollection: async (id, payload, payloadConfig) => {
      const { data } = await updateCollection(id, payload);
      const idConfig = data.config.id;
      await updateCollectionConfig(idConfig, payloadConfig);

      await revalidateAction(getTagCustodianCollection(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
      await revalidateAction(getCollectionHostTag(data.custodian.pid));
      await revalidateAction(TAG_COLLECTION_HOSTS);
      return data;
    },
    deleteCollection: async (id) => {
      await deleteCollection(id);
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_COLLECTIONS);
    },
    createWorkgroup: async (payload) => {
      const { data } = await createWorkgroup(payload);
      await revalidateAction(TAG_WORKGROUP_ADMIN);
      return data;
    },
    addCollectionsToWorkgroup: async (payload) => {
      const data = await addCollectionsToWorkgroup(payload);
      await revalidateAction(TAG_WORKGROUP_ADMIN);
      await revalidateAction(TAG_COLLECTION_ADMIN);
      return data.map((d) => d.data);
    },
    removeCollectionsFromWorkgroup: async (payload) => {
      await removeCollectionsFromWorkgroup(payload);
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_WORKGROUP_ADMIN);
    },
    addCollectionToWorkgroups: async (payload) => {
      const data = await addCollectionToWorkgroups(payload);
      await revalidateAction(TAG_WORKGROUP_ADMIN);
      await revalidateAction(TAG_COLLECTION_ADMIN);
      return data.map((d) => d.data);
    },
    removeCollectionFromWorkgroups: async (payload) => {
      await removeCollectionFromWorkgroups(payload);
      await revalidateAction(TAG_COLLECTION_ADMIN);
      await revalidateAction(TAG_WORKGROUP_ADMIN);
    },
    selectedWorkgroup: null,
    setSelectedWorkgroup: (selectedWorkgroup: Workgroup | null) =>
      set((state) => ({
        ...state,
        adminData: { ...state.adminData, selectedWorkgroup },
      })),
  },
  featureFlags: {
    flags: null,
    setFlags: (flags: FeatureFlag) =>
      set((state) => ({
        ...state,
        featureFlags: { ...state.featureFlags, flags },
      })),
  },
}));
