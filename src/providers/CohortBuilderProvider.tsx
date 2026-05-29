"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
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
import { RuleLeafType, RuleNodeType } from "@/types/rules";

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
  const [conceptDrag, setConceptDrag] = useState<{
    concept: Concept;
    placeholder: RuleLeafType;
    sourceRuleId: string;
    placeholderInserted: boolean;
  } | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const [sortableNodes, setSortableNodes] = useState(
    () => new Map<string, HTMLElement>(),
  );

  const registerSortableNode = useCallback(
    (id: string, node: HTMLElement | null) => {
      setSortableNodes((prev) => {
        const next = new Map(prev);
        if (node) {
          next.set(id, node);
        } else {
          next.delete(id);
        }
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

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      setActive(e.active);

      if (e.active.data.current?.type === "Concept") {
        const concept = e.active.data.current.concept as Concept;
        const sourceRuleId = e.active.data.current.sourceRuleId as string;
        setConceptDrag({
          concept,
          placeholder: createRule({ concept }),
          sourceRuleId,
          placeholderInserted: false,
        });
        return;
      }

      const node = findById(queryBuilderJson, e.active.id as string);
      if (node) {
        setActiveNode(node);
      }
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
      let targetIndex = groupItems.indexOf(overData.id);
      targetIndex = targetIndex < 0 ? 0 : targetIndex;

      if (overData.type === "Spacer") {
        if (overData.position === "top") {
          targetIndex = 0;
        } else if (overData.position === "bottom") {
          targetIndex = groupItems.length;
        } else {
          targetIndex = overData.position;
        }
      }

      if (activeData?.type === "Concept") {
        if (!conceptDrag) return;
        if (over.id === conceptDrag.sourceRuleId) return;

        if (!conceptDrag.placeholderInserted) {
          let updated = insertIntoGroup(
            queryBuilderJson,
            overGroupId,
            conceptDrag.placeholder,
            targetIndex,
          );
          updated = updateById(updated, overGroupId, (g) =>
            isRuleGroup(g)
              ? { ...g, rules: insertMissingOperators(g.rules) }
              : g,
          );
          setQueryBuilderJson(updated, errorOnDrag);
          setConceptDrag((prev) => prev && { ...prev, placeholderInserted: true });
        } else {
          setQueryBuilderJson(
            moveItemIntoGroup(
              queryBuilderJson,
              conceptDrag.placeholder.id,
              overGroupId,
              targetIndex,
            ),
            errorOnDrag,
          );
        }
        return;
      }

      const activeGroupId = activeData?.groupId;
      if (!activeGroupId) return;
      if (
        !queryBuilderAllowNestedGroups &&
        activeData.type === "Group" &&
        overGroupId !== activeGroupId
      )
        return;
      if (activeData.id === overData.id) return;

      setQueryBuilderJson(
        moveItemIntoGroup(
          queryBuilderJson,
          activeData.id as string,
          overGroupId,
          targetIndex,
        ),
        errorOnDrag,
      );
    },
    [
      active,
      boardIndex,
      conceptDrag,
      errorOnDrag,
      queryBuilderJson,
      setQueryBuilderJson,
      queryBuilderAllowNestedGroups,
    ],
  );

  const cancelConceptDrag = useCallback(() => {
    if (conceptDrag?.placeholderInserted) {
      setQueryBuilderJson(
        removeById(queryBuilderJson, conceptDrag.placeholder.id),
      );
    }
    setConceptDrag(null);
    setActive(null);
  }, [conceptDrag, queryBuilderJson, setQueryBuilderJson]);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { over } = e;

      if (!over || !active) {
        cancelConceptDrag();
        setActiveNode(null);
        setActive(null);
        return;
      }

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === "Concept") {
        if (!conceptDrag) {
          setActive(null);
          return;
        }

        const { concept, placeholder, sourceRuleId, placeholderInserted } =
          conceptDrag;
        const overGroupId = overData?.groupId;

        // Cancel: dropped on source card or no valid drop target
        if (!overGroupId || over.id === sourceRuleId) {
          cancelConceptDrag();
          return;
        }

        const removeConceptFromSource = (node: RuleNodeType) => {
          if (!isRuleLeaf(node) || !isMultipleConcept(node.rule.concept))
            return node;
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

        const normalizeOps = (group: RuleNodeType) =>
          isRuleGroup(group)
            ? { ...group, rules: insertMissingOperators(group.rules) }
            : group;

        // Merge into an existing rule card when dropped directly onto it
        if (overData.type === "Rule") {
          const targetRuleId = over.id as string;
          let updated = placeholderInserted
            ? removeById(queryBuilderJson, placeholder.id)
            : queryBuilderJson;
          updated = updateById(updated, sourceRuleId, removeConceptFromSource);
          updated = updateById(updated, targetRuleId, (node) => {
            if (!isRuleLeaf(node)) return node;
            const existing = node.rule.concept;
            const merged = Array.isArray(existing)
              ? [...existing, concept]
              : existing != null
              ? [existing, concept]
              : concept;
            return { ...node, rule: { ...node.rule, concept: merged } };
          });
          setQueryBuilderJson(updated);
          setConceptDrag(null);
          setActive(null);
          return;
        }

        // Standalone rule: resolve target index
        const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
        let targetIndex = groupItems.indexOf(overData.id);
        targetIndex = targetIndex < 0 ? 0 : targetIndex;
        if (overData.type === "Spacer") {
          targetIndex =
            overData.position === "top" ? 0 : groupItems.length;
        }

        if (placeholderInserted) {
          // Placeholder already at the right position — just strip from source
          let updated = updateById(
            queryBuilderJson,
            sourceRuleId,
            removeConceptFromSource,
          );
          updated = updateById(updated, overGroupId, normalizeOps);
          setQueryBuilderJson(updated);
        } else {
          // No placeholder in tree (fast drop) — insert directly
          const newRule = createRule({ concept });
          let updated = updateById(
            queryBuilderJson,
            sourceRuleId,
            removeConceptFromSource,
          );
          updated = insertIntoGroup(updated, overGroupId, newRule, targetIndex);
          updated = updateById(updated, overGroupId, normalizeOps);
          setQueryBuilderJson(updated);
        }

        setConceptDrag(null);
        setActive(null);
        return;
      }

      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (
        !overGroupId ||
        !activeGroupId ||
        (activeData.type === "Group" && overGroupId !== activeGroupId)
      ) {
        setActiveNode(null);
        setActive(null);
        return;
      }

      const groupItems = boardIndex.itemsByGroup[overGroupId] ?? [];
      let targetIndex = groupItems.indexOf(overData.id);

      targetIndex = targetIndex < 0 ? 0 : targetIndex;

      if (overData.type === "Spacer") {
        if (overData.position === "top") {
          targetIndex = 0;
        } else {
          targetIndex = groupItems.length;
        }
      }

      setQueryBuilderJson(
        moveItemIntoGroup(
          queryBuilderJson,
          activeData.id,
          overGroupId,
          targetIndex,
        ),
      );

      setActiveNode(null);
      setActive(null);
    },
    [active, boardIndex, cancelConceptDrag, conceptDrag, queryBuilderJson, setQueryBuilderJson],
  );

  const { handleContextMenu, ...rightClickMenuMethods } = useRightClickMenu();

  const actions = useMemo<Action[]>(
    () => [
      {
        action: () => createAndScroll(createNewRule),
        label: "Add rule",
      },
      {
        action: () => createAndScroll(createNewOperator),
        label: "Add and/or",
      },
      {
        action: () => createAndScroll(createNewAgeFilter),
        label: "Add age rule",
      },
      {
        action: () => createAndScroll(createNewGroup),
        label: "Add group",
      },
    ],
    [
      createAndScroll,
      createNewAgeFilter,
      createNewRule,
      createNewGroup,
      createNewOperator,
    ],
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
    [
      active,
      activeNode,
      handleContextMenu,
      actions,
      hoveredKey,
      registerSortableNode,
      getSortableNode,
      createAndScroll,
      pendingScrollToNodeId,
    ],
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
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
      >
        {children}
        <RightClickMenu {...rightClickMenuMethods} actions={actions} />
        <DragOverlay node={activeNode} concept={conceptDrag?.concept ?? null} />
      </DndContext>
    </CohortBuilderContext.Provider>
  );
};
