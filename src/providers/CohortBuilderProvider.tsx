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

// isRuleGroup and isRuleLeaf are tiny utility functions (in utils/rules.ts) that check if a node has a rules array (group) or a rule property (leaf rule).
// We need them in createAndScroll.
import {
  findById,
  isRuleGroup,
  isRuleLeaf,
  moveItemIntoGroup,
} from "@/utils/rules";

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const sortableNodeRefs = useRef(new Map<string, HTMLElement>());

  const registerSortableNode = useCallback(
    (id: string, node: HTMLElement | null) => {
      if (node) {
        sortableNodeRefs.current.set(id, node);
      } else {
        sortableNodeRefs.current.delete(id);
      }
    },
    [],
  );

  const getSortableNode = useCallback((id: string) => {
    return sortableNodeRefs.current.get(id);
  }, []);

  const [pendingScrollToNodeId, setPendingScrollToNodeId] = useState<
    string | null
  >(null);

  const createAndScroll = useCallback((create: () => RuleNodeType) => {
    const created = create();

    if (!created) return;

    // The shared scroll/focus signal usually targets the newly created node.
    // When doing "Add group", we want to target the first inner rule so that we can focus its input instead of the group card.
    const target = isRuleGroup(created)
      ? (created.rules.find(isRuleLeaf) ?? created)
      : created;

    setPendingScrollToNodeId(target.id);
    return created;
  }, []);

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      setActive(e.active);

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

      const activeGroupId = activeData?.groupId;
      const overGroupId = overData?.groupId;

      if (!overGroupId || !activeGroupId) return;
      if (
        !queryBuilderAllowNestedGroups &&
        activeData.type === "Group" &&
        overGroupId !== activeGroupId
      )
        return;
      if (activeData.id === overData.id) return;

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
      errorOnDrag,
      queryBuilderJson,
      setQueryBuilderJson,
      queryBuilderAllowNestedGroups,
    ],
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { over } = e;

      if (!over || !active) {
        setActiveNode(null);
        setActive(null);
        return;
      }

      const activeData = active.data.current;
      const overData = over.data.current;

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
    [active, boardIndex, queryBuilderJson, setQueryBuilderJson],
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
        <DragOverlay node={activeNode} />
      </DndContext>
    </CohortBuilderContext.Provider>
  );
};
