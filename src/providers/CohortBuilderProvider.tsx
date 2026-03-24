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
import { RuleNodeType } from "@/types/rules";
import { findById, moveItemIntoGroup } from "@/utils/rules";

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const [active, setActive] = useState<Active | null>(null);
  const [activeNode, setActiveNode] = useState<RuleNodeType | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

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

      if (
        !overGroupId ||
        !activeGroupId ||
        (activeData.type === "Group" && overGroupId !== activeGroupId)
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
    [active, boardIndex, errorOnDrag, queryBuilderJson, setQueryBuilderJson],
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
      { action: createNewRule, label: "Add Rule" },
      { action: createNewOperator, label: "Add Operator" },
      { action: createNewAgeFilter, label: "Add Age Rule" },
      { action: createNewGroup, label: "Add Group" },
    ],
    [createNewAgeFilter, createNewRule, createNewGroup, createNewOperator],
  );

  const value = useMemo(
    () => ({
      active,
      activeNode,
      handleContextMenu,
      actions,
      hoveredKey,
      setHoveredKey,
    }),
    [active, activeNode, handleContextMenu, actions, hoveredKey],
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
