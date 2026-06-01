"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Active,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import DragOverlay from "@/components/DragOverlay";
import RightClickMenu from "@/components/RightClickMenu/RightClickMenu";
import useRightClickMenu from "@/hooks/useRightClickMenu";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { RuleNodeType } from "@/types/rules";
import { DragType } from "@/types/dnd";

import {
  createRule,
  findById,
  insertIntoGroup,
  insertMissingOperators,
  isMultipleConcept,
  isRuleGroup,
  isRuleLeaf,
  moveItemIntoGroup,
  removeById,
  updateById,
} from "@/utils/rules";
import { Concept } from "@/types/api";

import useFeatures from "@/hooks/useFeatures";

// ─── Pure helpers ────────────────────────────────────────────────────────────

const resolveTargetIndex = (
  overData: Record<string, unknown>,
  groupItems: string[],
): number => {
  if (overData.type === DragType.Spacer) {
    if (overData.position === "top") return 0;
    if (overData.position === "bottom") return groupItems.length;
    return overData.position as number;
  }
  const idx = groupItems.indexOf(overData.id as string);
  return idx < 0 ? 0 : idx;
};

const removeConceptFromSource =
  (concept: Concept) =>
  (node: RuleNodeType): RuleNodeType => {
    if (!isRuleLeaf(node) || !isMultipleConcept(node.rule.concept)) return node;
    const remaining = (node.rule.concept as Concept[]).filter(
      (c) => c.concept_id !== concept.concept_id,
    );
    if (remaining.length === 1) {
      const { alternatives: _omit, ...single } = remaining[0] as Concept & {
        alternatives?: Concept[];
      };
      return { ...node, rule: { ...node.rule, concept: single } };
    }
    return { ...node, rule: { ...node.rule, concept: remaining } };
  };

const normaliseOps = (group: RuleNodeType): RuleNodeType =>
  isRuleGroup(group)
    ? { ...group, rules: insertMissingOperators(group.rules) }
    : group;

const mergeConceptIntoRule =
  (concept: Concept) =>
  (node: RuleNodeType): RuleNodeType => {
    if (!isRuleLeaf(node)) return node;
    const existing = node.rule.concept;
    const merged = Array.isArray(existing)
      ? [...existing, concept]
      : existing != null
        ? [existing, concept]
        : concept;
    return { ...node, rule: { ...node.rule, concept: merged } };
  };

// ─── Context ─────────────────────────────────────────────────────────────────

type Action = {
  action: () => void;
  label: string;
};

type CohortBuilderContextValue = {
  active: Active | null;
  activeNode: RuleNodeType | null;
  handleContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
  actions: Action[];

  hoveredKey: string | null;
  setHoveredKey: (key: string | null) => void;

  registerSortableNode: (id: string, node: HTMLElement | null) => void;
  getSortableNode: (id: string) => HTMLElement | undefined;
  createAndScroll: (create: () => RuleNodeType) => RuleNodeType | undefined;

  pendingScrollToNodeId: string | null;
  clearPendingScrollToNodeId: () => void;
  scrollToNode: (id: string) => void;
};

const CohortBuilderContext = createContext<CohortBuilderContextValue | null>(
  null,
);

export const useCohortBuilderContext = () => {
  const ctx = useContext(CohortBuilderContext);
  if (!ctx) {
    throw new Error(
      "useCohortBuilderContext must be used within CohortBuilderProvider",
    );
  }
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────

type CohortBuilderProviderProps = {
  children: React.ReactNode;
  errorOnDrag?: boolean;
};

export const CohortBuilderProvider = ({
  children,
  errorOnDrag = false,
}: CohortBuilderProviderProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    boardIndex,
    createNewGroup,
    createNewRule,
    createNewAgeFilter,
    createNewOperator,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    boardIndex: qb.boardIndex,
    createNewGroup: qb.createNewGroup,
    createNewRule: qb.createNewRule,
    createNewAgeFilter: qb.createNewAgeFilter,
    createNewOperator: qb.createNewOperator,
  }));

  const { queryBuilderAllowNestedGroups } = useFeatures();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const [active, setActive] = useState<Active | null>(null);
  const [activeNode, setActiveNode] = useState<RuleNodeType | null>(null);
  const lastPlaceholderPos = useRef<{ groupId: string; index: number } | null>(
    null,
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const [sortableNodes, setSortableNodes] = useState(
    () => new Map<string, HTMLElement>(),
  );

  const registerSortableNode = useCallback(
    (id: string, node: HTMLElement | null) => {
      setSortableNodes((prev) => {
        const next = new Map(prev);
        if (node) next.set(id, node);
        else next.delete(id);
        return next;
      });
    },
    [],
  );

  const getSortableNode = useCallback(
    (id: string) => sortableNodes.get(id),
    [sortableNodes],
  );

  const [pendingScrollToNodeId, setPendingScrollToNodeId] = useState<
    string | null
  >(null);

  const createAndScroll = useCallback((create: () => RuleNodeType) => {
    const created = create();
    if (!created) return;
    const target = isRuleGroup(created)
      ? (created.rules.find(isRuleLeaf) ?? created)
      : created;
    setPendingScrollToNodeId(target.id);
    return created;
  }, []);

  const resetDragState = useCallback(() => {
    lastPlaceholderPos.current = null;
    setActiveNode(null);
    setActive(null);
  }, []);

  const cancelConceptDrag = useCallback(() => {
    if (activeNode && findById(queryBuilderJson, activeNode.id)) {
      setQueryBuilderJson(removeById(queryBuilderJson, activeNode.id));
    }
    resetDragState();
  }, [activeNode, queryBuilderJson, setQueryBuilderJson, resetDragState]);

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      setActive(e.active);

      if (e.active.data.current?.type === DragType.Concept) {
        const concept = e.active.data.current.concept as Concept;
        const sourceRuleId = e.active.data.current.sourceRuleId as string;
        const sourceRule = findById(queryBuilderJson, sourceRuleId);
        const base = createRule({ concept });
        if (sourceRule && isRuleLeaf(sourceRule)) {
          const { timeConstraint, timeConstraintOperator, ageConstraint, ageConstraintOperator } = sourceRule;
          setActiveNode({
            ...base,
            ...(timeConstraint !== undefined && { timeConstraint }),
            ...(timeConstraintOperator !== undefined && { timeConstraintOperator }),
            ...(ageConstraint !== undefined && { ageConstraint }),
            ...(ageConstraintOperator !== undefined && { ageConstraintOperator }),
          });
        } else {
          setActiveNode(base);
        }
        return;
      }

      const node = findById(queryBuilderJson, e.active.id as string);
      if (node) setActiveNode(node);
    },
    [queryBuilderJson],
  );

  const onDragOver = useCallback(
    (e: DragOverEvent) => {
      const { over } = e;
      if (!over || !active) return;

      const activeData = active.data.current;
      const overData = over.data.current;
      const overGroupId = overData?.groupId;
      if (!overGroupId) return;

      const groupItems = boardIndex?.itemsByGroup?.[overGroupId] ?? [];
      const targetIndex = resolveTargetIndex(overData, groupItems);

      if (activeData?.type === DragType.Concept) {
        if (!activeNode) return;
        const isInTree = !!findById(queryBuilderJson, activeNode.id);

        if (over.id === activeData.sourceRuleId) {
          if (isInTree) {
            setQueryBuilderJson(removeById(queryBuilderJson, activeNode.id));
            lastPlaceholderPos.current = null;
          }
          return;
        }

        if (
          isInTree &&
          lastPlaceholderPos.current?.groupId === overGroupId &&
          lastPlaceholderPos.current?.index === targetIndex
        )
          return;

        const updated = !isInTree
          ? insertIntoGroup(queryBuilderJson, overGroupId, activeNode, targetIndex)
          : moveItemIntoGroup(queryBuilderJson, activeNode.id, overGroupId, targetIndex);

        setQueryBuilderJson(updated, errorOnDrag);
        lastPlaceholderPos.current = { groupId: overGroupId, index: targetIndex };
        return;
      }

      const activeGroupId = activeData?.groupId;
      if (!activeGroupId) return;
      if (!queryBuilderAllowNestedGroups && activeData.type === DragType.Group && overGroupId !== activeGroupId) return;
      if (activeData.id === overData.id) return;

      setQueryBuilderJson(
        moveItemIntoGroup(queryBuilderJson, activeData.id as string, overGroupId, targetIndex),
        errorOnDrag,
      );
    },
    [active, activeNode, boardIndex, errorOnDrag, queryBuilderJson, setQueryBuilderJson, queryBuilderAllowNestedGroups],
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { over } = e;

      if (!over || !active) {
        if (active?.data.current?.type === DragType.Concept) cancelConceptDrag();
        else resetDragState();
        return;
      }

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === DragType.Concept) {
        if (!activeNode) { setActive(null); return; }

        const concept = activeData.concept as Concept;
        const sourceRuleId = activeData.sourceRuleId as string;
        const overGroupId = overData?.groupId;

        if (!overGroupId || over.id === sourceRuleId) {
          cancelConceptDrag();
          return;
        }

        const placeholderInTree = !!findById(queryBuilderJson, activeNode.id);

        // Merge into an existing rule card
        if (overData.type === DragType.Rule && over.id !== activeNode.id) {
          let updated = placeholderInTree
            ? removeById(queryBuilderJson, activeNode.id)
            : queryBuilderJson;
          updated = updateById(updated, sourceRuleId, removeConceptFromSource(concept));
          updated = updateById(updated, over.id as string, mergeConceptIntoRule(concept));
          setQueryBuilderJson(updated);
          resetDragState();
          return;
        }

        // Standalone drop — use placeholder position if available, otherwise insert
        const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
        const targetIndex = resolveTargetIndex(overData, groupItems);
        let updated = placeholderInTree
          ? queryBuilderJson
          : insertIntoGroup(queryBuilderJson, overGroupId, activeNode, targetIndex);
        updated = updateById(updated, sourceRuleId, removeConceptFromSource(concept));
        updated = updateById(updated, overGroupId, normaliseOps);
        setQueryBuilderJson(updated);
        resetDragState();
        return;
      }

      // Rule / group drag
      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (!overGroupId || !activeGroupId || (activeData.type === DragType.Group && overGroupId !== activeGroupId)) {
        resetDragState();
        return;
      }

      const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
      const targetIndex = resolveTargetIndex(overData, groupItems);

      setQueryBuilderJson(
        moveItemIntoGroup(queryBuilderJson, activeData.id, overGroupId, targetIndex),
      );
      resetDragState();
    },
    [active, activeNode, boardIndex, cancelConceptDrag, queryBuilderJson, resetDragState, setQueryBuilderJson],
  );

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const actions = useMemo<Action[]>(
    () => [
      { action: () => createAndScroll(createNewRule), label: "Add rule" },
      { action: () => createAndScroll(createNewOperator), label: "Add and/or" },
      { action: () => createAndScroll(createNewAgeFilter), label: "Add age rule" },
      { action: () => createAndScroll(createNewGroup), label: "Add group" },
    ],
    [createAndScroll, createNewAgeFilter, createNewRule, createNewGroup, createNewOperator],
  );

  const value = useMemo(
    () => ({
      active,
      activeNode,
      handleContextMenu,
      actions,
      hoveredKey,
      setHoveredKey,
      registerSortableNode,
      getSortableNode,
      createAndScroll,
      pendingScrollToNodeId,
      clearPendingScrollToNodeId: () => setPendingScrollToNodeId(null),
      scrollToNode: (id: string) => setPendingScrollToNodeId(id),
    }),
    [active, activeNode, handleContextMenu, actions, hoveredKey, registerSortableNode, getSortableNode, createAndScroll, pendingScrollToNodeId],
  );

  return (
    <CohortBuilderContext.Provider value={value}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        collisionDetection={closestCorners}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        {children}
        <RightClickMenu {...rightClickMenuMethods} actions={actions} />
        <DragOverlay node={activeNode} />
      </DndContext>
    </CohortBuilderContext.Provider>
  );
};
