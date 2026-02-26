import { create } from "zustand";
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
import { DatasetErrors } from "@/utils/datasets";
import { FeatureName } from "@/types/api";
import { useFeatureFlagsStore } from "@/store/featureFlagsStore";

export enum NodeKind {
  RULE = "RULE",
  GROUP = "GROUP",
  OPERATOR = "OPERATOR",
  AGE_FILTER = "AGE_FILTER",
}

type NodeFactory = () => RuleNodeType | RuleNodeType[];

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

  selectedGuidance: Record<string, boolean>;
  setSelectedGuidance: (id: string, value: boolean) => void;
}

export const useQueryBuilderStore = create<QueryBuilderStoreState>(
  (set, get) => ({
    queryName: "",
    setQueryName: (name) =>
      set((state) => ({
        ...state,
        queryName: name,
      })),

    queryBuilderJson: validateRuleTree(DEFAULT_QUERY),
    resetQueryBuilderJson: (resetQueryName?: boolean) => {
      const { setQueryBuilderJson } = get();
      setQueryBuilderJson(DEFAULT_QUERY);

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

    createNewNode: (kind: NodeKind, above: boolean = true) => {
      const fn = Creators[kind];

      const {
        selected,
        queryBuilderJson,
        setQueryBuilderJson,
        setSelected,
        boardIndex,
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
          ...(skipFirstOperator && additions.length > 1
            ? additions.slice(1)
            : additions),
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

    createNewRule: (above = true) => get().createNewNode(NodeKind.RULE, above),
    createNewGroup: (above = true) =>
      get().createNewNode(NodeKind.GROUP, above),
    createNewOperator: (above = true) =>
      get().createNewNode(NodeKind.OPERATOR, above),
    createNewAgeFilter: (above = true) =>
      get().createNewNode(NodeKind.AGE_FILTER, above),

    queryAsText: queryToText(DEFAULT_QUERY),

    setQueryBuilderJson: (query, validate = true) => {
      const updatedQuery = validate ? get().validateRules(query) : query;
      const text = updatedQuery.valid ? queryToText(updatedQuery) : "";

      set((state) => ({
        ...state,

        queryBuilderJson: updatedQuery,
        boardIndex: buildIndexFromModel(updatedQuery),
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
        const category = Array.isArray(c) ? c[0]?.category : c?.category;
        name += `${category ?? "Blank"} rule`.trim();
      } else if (isOperator(node))
        name += `${node.combinator.toUpperCase()} operator`;
      else if (isAgeFilter(node)) name += "Age Filter";
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

    selectedDatasets: [],
    setSelectedDatasets: (pids) => {
      set((state) => ({
        ...state,

        selectedDatasets: pids,
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

    getQueryFromText: async (input: string) => {
      const cleanQuery = (queryString: string) => {
        const query = JSON.parse(queryString) as RuleGroupType;
        if (query.rules.length === 1 && isRuleGroup(query.rules[0])) {
          return { ...query, rules: groupToRules(query.rules[0]) };
        }
        return query;
      };

      const { data: newQueryString } = await parseQuery(input);
      const newQuery = cleanQuery(newQueryString);
      return get().setQueryBuilderJson(newQuery);
    },

    validateRules: (root) => {
      const featureFlags = useFeatureFlagsStore.getState().flags;

      return validateRuleTree(root, {
        constrainForBunnyV1:
          featureFlags?.[FeatureName.ConstrainForBunnyV1] || false,
      });
    },

    selectedGuidance: {},
    setSelectedGuidance: (id: string, value: boolean) =>
      set((state) => ({
        ...state,
        selectedGuidance: { [id]: value },
      })),
  }),
);
