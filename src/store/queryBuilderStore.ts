import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import parseQuery from "@/actions/query/parseQuery";
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
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  updateById,
  validateRuleTree,
  isAgeFilter,
  groupToRules,
  findById,
} from "@/utils/rules";
import { UniqueIdentifier } from "@dnd-kit/core";
import { removeFalseKeys } from "@/utils/numbers";
import { EXAMPLE_1, NO_QUERY } from "@/config/queryExamples";
import { DatasetErrors } from "@/utils/datasets";
import { Collection } from "@/types/api";
import { FeatureName } from "@/types/features";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";
import { intersection } from "lodash";
import { getAllowedDatasetIds } from "@/utils/collections";
import { getDomain } from "@/utils/omop";
import { useUserDataStore } from "@/hooks/userDataStore";

export enum NodeKind {
  RULE = "RULE",
  GROUP = "GROUP",
  OPERATOR = "OPERATOR",
  AGE_FILTER = "AGE_FILTER",
}

type NodeFactory = () => RuleNodeType | RuleNodeType[];

type SelectNodeWithModifiersArgs = {
  shiftKey?: boolean;
  metaKey?: boolean;
};

export const Creators: Record<string, NodeFactory> = {
  [NodeKind.RULE]: createRule,
  [NodeKind.GROUP]: createRuleGroup,
  [NodeKind.OPERATOR]: createOperator,
  [NodeKind.AGE_FILTER]: createAgeFilter,
};

export const DEFAULT_QUERY: RuleGroupType =
  process.env.NEXT_PUBLIC_USE_EXAMPLE_QUERY === "true" ? EXAMPLE_1 : NO_QUERY;

export interface QueryBuilderStoreState {
  queryName: string;
  setQueryName: (name: string) => void;

  queryBuilderJson: RuleGroupType;
  setQueryBuilderJson: (
    query: RuleGroupType,
    validate?: boolean,
    defaultInvalidText?: string,
  ) => RuleGroupType;
  resetQueryBuilderJson: (resetQueryName?: boolean) => void;

  errors: string[];
  setErrors: (rules: RuleGroupType, datasetPids: string[]) => void;
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
  helpTooltipOpen: boolean;
  setHelpTooltipOpen: (open: boolean, durationMs?: number) => void;

  selected: Record<UniqueIdentifier, boolean>;
  setSelected: (
    id: UniqueIdentifier | UniqueIdentifier[],
    next?: boolean,
    reset?: boolean,
  ) => void;
  select: (id: UniqueIdentifier | UniqueIdentifier[]) => void;
  deselect: (id: UniqueIdentifier | UniqueIdentifier[]) => void;
  toggleSelected: (id: UniqueIdentifier, reset?: boolean) => void;
  selectNodeWithModifiers: (
    node: RuleNodeType,
    modifiers?: SelectNodeWithModifiersArgs,
  ) => void;

  createNewNode: (kind: NodeKind) => RuleNodeType;
  createNewRule: () => RuleNodeType;
  createNewGroup: () => RuleNodeType;
  createNewOperator: () => RuleNodeType;
  createNewAgeFilter: () => RuleNodeType;

  queryAsText: string;
  getQueryFromText: (
    input: string,
    options?: { commit?: boolean; ignoreSynthetic?: boolean },
  ) => Promise<RuleGroupType>;

  previouslySelectedDatasets: string[];
  setPreviouslySelectedDatasets: (pids: string[]) => void;

  selectedDatasets: string[];
  setSelectedDatasets: (pids: string[]) => void;

  hasSelectedSyntheticDatasets: boolean;

  initialiseSelectedDatasets: (
    collections: Collection[],
    includeSynthetic: boolean,
  ) => void;

  checkSelectedDatasets: (collections: Collection[]) => void;

  openSelectDatasetsPanel: boolean;
  setOpenSelectDatasetsPanel: (value: boolean) => void;

  showDescendants: Record<UniqueIdentifier, boolean>;
  setShowDescendants: (
    id: UniqueIdentifier | UniqueIdentifier[],
    next?: boolean,
  ) => void;

  validateRules: (root: RuleGroupType) => RuleGroupType;

  selectedGuidance: Record<string, boolean>;
  setSelectedGuidance: (id: string, value: boolean) => void;
}

const state: StateCreator<QueryBuilderStoreState> = (set, get) => ({
  queryName: "",
  setQueryName: (name) =>
    set((state) => ({
      ...state,
      queryName: name,
    })),

  queryBuilderJson: validateRuleTree(DEFAULT_QUERY),
  resetQueryBuilderJson: (resetQueryName?: boolean) => {
    const { setQueryBuilderJson } = get();
    setQueryBuilderJson(DEFAULT_QUERY, true, "");

    set((state) => ({
      ...state,
      selected: {},
      ...(resetQueryName ? { queryName: "" } : {}),
    }));
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
      errors,
    }));
  },
  appendError: (error) =>
    set((state) => ({
      ...state,
      errors: [...state.errors, error],
    })),

  boardIndex: buildIndexFromModel(DEFAULT_QUERY),

  sizeCache: {},
  setSizeCache: (id, width, height) =>
    set((state) => ({
      ...state,
      sizeCache: {
        ...state.sizeCache,
        [id]: { width, height },
      },
    })),

  hovered: {},
  setHovered: async (id: UniqueIdentifier, reset: boolean = false) => {
    set((state) => ({
      ...state,
      hovered: { [id]: !reset },
    }));
  },

  helpTooltipOpen: true,
  setHelpTooltipOpen: (open: boolean, durationMs: number = 0) => {
    set((state) => ({
      ...state,
      helpTooltipOpen: open,
    }));

    if (open && durationMs > 0) {
      setTimeout(() => {
        set((state) => ({
          ...state,
          helpTooltipOpen: false,
        }));
      }, durationMs);
    }
  },

  selected: {},
  setSelected: (id, nextValue = true, reset = false) => {
    const ids = Array.isArray(id) ? id : [id];
    const uniqueIds = Array.from(new Set(ids));

    set((state) => {
      const curr = reset ? {} : (state.selected ?? {});
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
        selected: nextSelected,
      };
    });
  },
  select: (id) => get().setSelected(id, true),
  deselect: (id) => get().setSelected(id, false),
  toggleSelected: (id, reset = true) => {
    set((state) => {
      const prevSelected = state.selected ?? {};
      const isAlreadySelected = state.selected?.[id] === true;

      return {
        ...state,

        selected: {
          ...(reset
            ? isAlreadySelected
              ? removeFalseKeys(prevSelected)
              : {}
            : state.selected),
          [id]: !(state.selected?.[id] ?? false),
        },
      };
    });
  },
  selectNodeWithModifiers: (
    node: RuleNodeType,
    { shiftKey = false, metaKey = false }: SelectNodeWithModifiersArgs = {},
  ) => {
    const { selected, toggleSelected, setSelected, select, deselect } = get();

    const id = node.id;
    const isSelected = !!selected[id];

    if (shiftKey) {
      toggleSelected(id, false);
    } else {
      if (Object.keys(selected).length === 1 && isSelected) {
        toggleSelected(id, true);
      } else {
        setSelected(id, true, true);
      }
    }

    if (isRuleGroup(node) && metaKey) {
      const nextParent = !isSelected;

      node.rules.forEach((r) => {
        if (nextParent) {
          select(r.id);
        } else {
          deselect(r.id);
        }
      });
    }
  },

  createNewNode: (kind: NodeKind): RuleNodeType => {
    const fn = Creators[kind];

    const { queryBuilderJson, setQueryBuilderJson, setSelected } = get();

    const normaliseAdditions = (
      belowNeighbor?: RuleNodeType,
    ): { additions: RuleNodeType[]; primaryNode: RuleNodeType } => {
      const produced = fn();
      const additions = Array.isArray(produced) ? produced : [produced];
      const primaryNode = additions[0];

      const belowIsOperator = !!belowNeighbor && isOperator(belowNeighbor);
      const lastAdditionIsOperator = isOperator(
        additions[additions.length - 1],
      );

      const suffixWithOperator =
        belowNeighbor && !belowIsOperator && !lastAdditionIsOperator;

      return {
        additions: suffixWithOperator
          ? [...additions, createOperator()]
          : additions,
        primaryNode,
      };
    };

    const firstNode = queryBuilderJson.rules[0];
    const { additions: toPrepend, primaryNode } = normaliseAdditions(firstNode);

    const rules = [...toPrepend, ...queryBuilderJson.rules];

    const updatedQuery = { ...queryBuilderJson, rules };

    setSelected(
      toPrepend.slice(0, 1).map((r) => r.id),
      true,
      true,
    );

    setQueryBuilderJson(updatedQuery);
    return primaryNode;
  },

  createNewRule: () => get().createNewNode(NodeKind.RULE),
  createNewGroup: () => get().createNewNode(NodeKind.GROUP),
  createNewOperator: () => get().createNewNode(NodeKind.OPERATOR),
  createNewAgeFilter: () => get().createNewNode(NodeKind.AGE_FILTER),

  queryAsText: queryToText(DEFAULT_QUERY),

  setQueryBuilderJson: (
    query,
    validate = true,
    defaultInvalidText = "People who ...",
  ) => {
    const updatedQuery = validate ? get().validateRules(query) : query;

    let text = "";

    try {
      const nextText = queryToText(updatedQuery);

      if (typeof nextText === "string" && nextText.trim()) {
        text = nextText;
      }
    } catch {
      text = defaultInvalidText;
    }

    const currentSelected = get().selected;
    const prunedSelected = Object.fromEntries(
      Object.entries(currentSelected).filter(
        ([id, isSelected]) => isSelected && !!findById(updatedQuery, id),
      ),
    );

    set((state) => ({
      ...state,
      queryBuilderJson: updatedQuery,
      boardIndex: buildIndexFromModel(updatedQuery),
      selected: prunedSelected,
      ...(validate ? { queryAsText: text } : {}),
    }));

    get().setErrors(updatedQuery, get().selectedDatasets);
    return updatedQuery;
  },

  getNodeName: (node) => {
    if (node.name) return node.name;
    let name = "";

    if (!isAgeFilter(node) && node.exclude) name = "Excluded ";

    if (isRuleGroup(node)) name += "Group";
    else if (isRuleLeaf(node)) {
      const c = node.rule?.concept;
      const noun = getDomain(c, { useDefault: false }) ?? "Blank";

      name += `${noun} rule`.trim();
    } else if (isOperator(node))
      name += `${node.combinator.toUpperCase()} operator`;
    else if (isAgeFilter(node)) name += "Age Rule";
    else name += "Unknown";

    return name;
  },

  setNodeName: (node, name) => {
    get().setQueryBuilderJson(
      updateById(get().queryBuilderJson, node.id, (target) => ({
        ...target,
        name,
      })),
    );
  },

  initialiseSelectedDatasets: (collections, includeSynthetic) => {
    const { selectedDatasets } = get();
    const allowedIds = getAllowedDatasetIds(collections, includeSynthetic);

    const nextSelectedDatasets =
      selectedDatasets.length === 0
        ? allowedIds
        : intersection(allowedIds, selectedDatasets);

    get().setSelectedDatasets(nextSelectedDatasets);
  },

  checkSelectedDatasets: (collections) => {
    const { selectedDatasets } = get();
    const allowedIds = getAllowedDatasetIds(collections, true);

    const nextSelectedDatasets =
      selectedDatasets.length === 0
        ? allowedIds
        : intersection(allowedIds, selectedDatasets);

    get().setSelectedDatasets(nextSelectedDatasets);
  },

  previouslySelectedDatasets: [],
  setPreviouslySelectedDatasets: (pids) => {
    set((state) => ({
      ...state,

      previouslySelectedDatasets: pids,
    }));
  },

  hasSelectedSyntheticDatasets: false,
  selectedDatasets: [],
  setSelectedDatasets: (pids) => {
    const { userCollections } = useUserDataStore.getState();

    const syntheticPids = userCollections
      .filter((collection) => collection.is_synthetic)
      .map((collection) => collection.pid);

    const selectedSet = new Set(pids);

    const hasSelectedSyntheticDatasets = syntheticPids.some((pid) =>
      selectedSet.has(pid),
    );

    set((state) => ({
      ...state,
      selectedDatasets: pids,
      hasSelectedSyntheticDatasets,
    }));

    get().setErrors(get().queryBuilderJson, pids);
  },

  openSelectDatasetsPanel: false,
  setOpenSelectDatasetsPanel: (value) =>
    set((state) => ({
      ...state,

      openSelectDatasetsPanel: value,
    })),

  showDescendants: {},
  setShowDescendants: (id, nextValue = true) => {
    const ids = Array.isArray(id) ? id : [id];
    const uniqueIds = Array.from(new Set(ids));

    set((state) => {
      const curr = state.showDescendants ?? {};
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
        showDescendants: next,
      };
    });
  },

  getQueryFromText: async (
    input: string,
    {
      commit = false,
      ignoreSynthetic = false,
    }: { commit?: boolean; ignoreSynthetic?: boolean } = {},
  ) => {
    const cleanQuery = (queryString: string) => {
      const query = JSON.parse(queryString) as RuleGroupType;
      if (query.rules.length === 1 && isRuleGroup(query.rules[0])) {
        return { ...query, rules: groupToRules(query.rules[0]) };
      }
      return query;
    };
    const { data: newQueryString } = await parseQuery(input, {
      ignoreSynthetic,
    });
    const newQuery = cleanQuery(newQueryString);
    return commit ? get().setQueryBuilderJson(newQuery) : newQuery;
  },

  validateRules: (root) => {
    const featureFlags = useFeatureFlagsStore.getState().flags;

    return validateRuleTree(root, {
      constrainForBunnyV1:
        featureFlags?.[FeatureName.ConstrainForBunnyV1] || false,
      allowNestedGroups:
        featureFlags?.[FeatureName.QueryBuilderAllowNestedGroups] || false,
    });
  },

  selectedGuidance: {},
  setSelectedGuidance: (id: string, value: boolean) =>
    set((state) => ({
      ...state,
      selectedGuidance: { [id]: value },
    })),
});

export const useQueryBuilderStore = create<QueryBuilderStoreState>()(
  persist(state, {
    name: "query-builder-preferences",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      selectedDatasets: state.selectedDatasets,
      hasSelectedSyntheticDatasets: state.hasSelectedSyntheticDatasets,
    }),
  }),
);
